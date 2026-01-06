import { useMemo } from 'react';
import type { FormEvent } from 'react';
import { Button, IconButton, Stack, TextField, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { strings } from '../i18n';

interface ItemFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (name: string) => void;
  isDisabled: boolean;
}

const ItemForm = ({ value, onChange, onSubmit, isDisabled }: ItemFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const trimmed = useMemo(() => value.trim(), [value]);
  const isValid = trimmed.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isDisabled) {
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <TextField
          label={strings.productLabel}
          name="name"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={strings.placeholder}
          disabled={isDisabled}
          fullWidth
          required
          InputLabelProps={{ required: false }}
        />
        {isMobile ? (
          <IconButton
            type="submit"
            disabled={!isValid || isDisabled}
            aria-label={strings.addButton}
            sx={{
              width: 44,
              height: 44,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        ) : (
          <Button
            type="submit"
            disabled={!isValid || isDisabled}
            variant="contained"
            size="medium"
            sx={{ minWidth: 150, textTransform: 'none', fontSize: 17, px: 3, py: 1.4 }}
          >
            {strings.addButton}
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default ItemForm;
