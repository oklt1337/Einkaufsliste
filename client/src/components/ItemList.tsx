import type { ShoppingItemDTO } from '../../../shared/src/dto';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { strings } from '../i18n';

interface ItemListProps {
  items: ShoppingItemDTO[];
  onToggle: (id: string, bought: boolean) => void;
  onReorder: (orderedIds: string[]) => void;
  onChangeQuantity: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
  isDisabled: boolean;
}

const DraggableItem = ({
  item,
  onToggle,
  onChangeQuantity,
  onDelete,
  isDisabled,
}: {
  item: ShoppingItemDTO;
  onToggle: (id: string, bought: boolean) => void;
  onChangeQuantity: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
  isDisabled: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      divider
      disableGutters
      secondaryAction={
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={strings.decreaseQuantity(item.name)}>
            <span>
              <IconButton
                aria-label={strings.decreaseQuantity(item.name)}
                onClick={() => onChangeQuantity(item.id, item.quantity - 1)}
                disabled={isDisabled}
                size="small"
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Typography aria-label={strings.quantityOf(item.name)}>{item.quantity}</Typography>
          <Tooltip title={strings.increaseQuantity(item.name)}>
            <span>
              <IconButton
                aria-label={strings.increaseQuantity(item.name)}
                onClick={() => onChangeQuantity(item.id, item.quantity + 1)}
                disabled={isDisabled}
                size="small"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={strings.deleteItem(item.name)}>
            <span>
              <IconButton
                aria-label={strings.deleteItem(item.name)}
                onClick={() => onDelete(item.id)}
                disabled={isDisabled}
                size="small"
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      }
    >
      <Tooltip title={strings.dragToSort}>
        <span>
          <IconButton
            aria-label={strings.reorderItem(item.name)}
            {...attributes}
            {...listeners}
            disabled={isDisabled}
            size="small"
            sx={{ cursor: 'grab' }}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Checkbox
        checked={item.bought}
        onChange={(event) => onToggle(item.id, event.target.checked)}
        disabled={isDisabled}
        slotProps={{ input: { 'aria-label': strings.itemBought(item.name) } }}
      />
      <ListItemText
        primary={
          <Typography
            sx={{
              textDecoration: item.bought ? 'line-through' : 'none',
              color: item.bought ? 'text.secondary' : 'text.primary',
            }}
          >
            {item.name}
          </Typography>
        }
      />
    </ListItem>
  );
};

const ItemList = ({
  items,
  onToggle,
  onReorder,
  onChangeQuantity,
  onDelete,
  isDisabled,
}: ItemListProps) => {
  const itemIds = items.map((item) => item.id);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) {
          return;
        }
        const oldIndex = itemIds.indexOf(String(active.id));
        const newIndex = itemIds.indexOf(String(over.id));
        const nextIds = arrayMove(itemIds, oldIndex, newIndex);
        onReorder(nextIds);
      }}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <List aria-label="Einkaufsliste">
          {items.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              onToggle={onToggle}
              onChangeQuantity={onChangeQuantity}
              onDelete={onDelete}
              isDisabled={isDisabled}
            />
          ))}
        </List>
      </SortableContext>
    </DndContext>
  );
};

export default ItemList;
