import { useEffect, useMemo, useState } from 'react';
import type { ShoppingItemDTO } from '../../shared/src/dto';
import { createItem, deleteItem, getItems, updateItem } from './api/items';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import {
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  IconButton,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import { strings } from './i18n';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { getListTitle, updateListTitle } from './api/list';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unbekannter Fehler';
};

const App = () => {
  const [items, setItems] = useState<ShoppingItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [listTitle, setListTitle] = useState(strings.subtitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [isTitleSaving, setIsTitleSaving] = useState(false);

  useEffect(() => {
    const loadTitle = async () => {
      try {
        const data = await getListTitle();
        setListTitle(data.title);
        setTitleDraft(data.title);
      } catch {
        setListTitle(strings.subtitle);
        setTitleDraft(strings.subtitle);
      }
    };
    void loadTitle();
  }, []);

  const hasItems = items.length > 0;

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (a.bought !== b.bought) {
          return a.bought ? 1 : -1;
        }
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return b.createdAt.localeCompare(a.createdAt);
      }),
    [items],
  );

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const handleAdd = async (name: string) => {
    setIsMutating(true);
    setError(null);

    try {
      const created = await createItem({ name });
      setItems((prev) => {
        const exists = prev.some((item) => item.id === created.id);
        if (exists) {
          return prev.map((item) => (item.id === created.id ? created : item));
        }
        return [created, ...prev];
      });
      setNewItemName('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsMutating(false);
    }
  };

  const handleToggle = async (id: string, bought: boolean) => {
    setIsMutating(true);
    setError(null);

    try {
      const updated = await updateItem(id, { bought });
      if (!updated) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        return;
      }
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsMutating(false);
    }
  };

  const handleReorder = async (orderedIds: string[]) => {
    setIsMutating(true);
    setError(null);

    setItems((prev) => {
      const map = new Map(prev.map((item) => [item.id, item]));
      return orderedIds
        .map((id, index) => {
          const item = map.get(id);
          if (!item) {
            return null;
          }
          return { ...item, order: index };
        })
        .filter((item): item is ShoppingItemDTO => item !== null);
    });

    try {
      await Promise.all(orderedIds.map((id, index) => updateItem(id, { order: index })));
    } catch (err) {
      setError(getErrorMessage(err));
      await loadItems();
    } finally {
      setIsMutating(false);
    }
  };

  const handleChangeQuantity = async (id: string, quantity: number) => {
    setIsMutating(true);
    setError(null);

    try {
      if (quantity <= 0) {
        await deleteItem(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
        return;
      }

      const updated = await updateItem(id, { quantity });
      if (!updated) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        return;
      }
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsMutating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsMutating(true);
    setError(null);

    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsMutating(false);
    }
  };

  const handleStartEdit = () => {
    setTitleDraft(listTitle);
    setIsEditingTitle(true);
  };

  const handleCancelEdit = () => {
    setTitleDraft(listTitle);
    setIsEditingTitle(false);
  };

  const handleSaveTitle = async () => {
    const nextTitle = titleDraft.trim() || strings.subtitle;
    setIsTitleSaving(true);
    try {
      await updateListTitle({ title: nextTitle });
      setListTitle(nextTitle);
      setTitleDraft(nextTitle);
      setIsEditingTitle(false);
    } catch {
      setError(getErrorMessage(new Error('Titel konnte nicht gespeichert werden')));
    } finally {
      setIsTitleSaving(false);
    }
  };

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#d9a96b',
        contrastText: '#2f2416',
      },
      secondary: {
        main: '#6b5a41',
      },
      background: {
        default: '#f2f0eb',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Outfit", system-ui, sans-serif',
    },
    shape: {
      borderRadius: 16,
    },
  });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="page" aria-live="polite">
        <Card className="card" elevation={10}>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="overline" color="secondary">
                      {strings.title}
                    </Typography>
                    {!isEditingTitle && (
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<EditOutlinedIcon fontSize="small" />}
                        onClick={handleStartEdit}
                        sx={{ textTransform: 'none', px: 0.5, minWidth: 'auto' }}
                      >
                        {strings.editTitle}
                      </Button>
                    )}
                  </Stack>

                  {isEditingTitle ? (
                    <Stack spacing={1}>
                      <TextField
                        value={titleDraft}
                        onChange={(event) => setTitleDraft(event.target.value)}
                        aria-busy={isTitleSaving}
                        variant="outlined"
                        fullWidth
                        multiline
                        autoFocus
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            void handleSaveTitle();
                          }
                          if (event.key === 'Escape') {
                            event.preventDefault();
                            handleCancelEdit();
                          }
                        }}
                        InputProps={{
                          sx: {
                            fontSize: { xs: '1.6rem', sm: '2.125rem' },
                            fontWeight: 600,
                            lineHeight: 1.2,
                            '& textarea': {
                              overflowWrap: 'anywhere',
                            },
                          },
                        }}
                        inputProps={{ 'aria-label': strings.titleLabel }}
                      />
                      <Stack direction="row" spacing={1}>
                        {isMobile ? (
                          <>
                            <IconButton
                              aria-label={strings.save}
                              onClick={() => void handleSaveTitle()}
                              disabled={isTitleSaving}
                              color="primary"
                            >
                              <CheckIcon />
                            </IconButton>
                            <IconButton
                              aria-label={strings.cancel}
                              onClick={handleCancelEdit}
                              disabled={isTitleSaving}
                            >
                              <CloseIcon />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              onClick={() => void handleSaveTitle()}
                              disabled={isTitleSaving}
                            >
                              {strings.save}
                            </Button>
                            <Button
                              variant="text"
                              onClick={handleCancelEdit}
                              disabled={isTitleSaving}
                            >
                              {strings.cancel}
                            </Button>
                          </>
                        )}
                      </Stack>
                    </Stack>
                  ) : (
                    <Typography
                      variant="h4"
                      component="h1"
                      onDoubleClick={handleStartEdit}
                      sx={{
                        fontSize: { xs: '1.6rem', sm: '2.125rem' },
                        fontWeight: 600,
                        lineHeight: 1.2,
                        wordBreak: 'break-word',
                      }}
                    >
                      {listTitle}
                    </Typography>
                  )}
                </Box>
              </Stack>

              <ItemForm
                value={newItemName}
                onChange={setNewItemName}
                onSubmit={handleAdd}
                isDisabled={isLoading || isMutating}
              />

              {error && (
                <Box className="alert" role="alert">
                  {error}
                </Box>
              )}

              {isLoading ? (
                <Typography color="text.secondary">{strings.loading}</Typography>
              ) : hasItems ? (
                <ItemList
                  items={sortedItems}
                  onToggle={handleToggle}
                  onReorder={handleReorder}
                  onChangeQuantity={handleChangeQuantity}
                  onDelete={handleDelete}
                  isDisabled={isMutating}
                />
              ) : (
                <Typography color="text.secondary">{strings.empty}</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default App;
