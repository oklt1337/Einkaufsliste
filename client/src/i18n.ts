type Strings = {
  title: string;
  subtitle: string;
  titleLabel: string;
  editTitle: string;
  save: string;
  cancel: string;
  productLabel: string;
  placeholder: string;
  addButton: string;
  loading: string;
  empty: string;
  dragToSort: string;
  itemBought: (name: string) => string;
  decreaseQuantity: (name: string) => string;
  increaseQuantity: (name: string) => string;
  deleteItem: (name: string) => string;
  reorderItem: (name: string) => string;
  quantityOf: (name: string) => string;
};

const isGerman =
  typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('de');

export const strings: Strings = isGerman
  ? {
      title: 'Einkaufsliste',
      subtitle: 'Was brauchst du heute?',
      titleLabel: 'Listenname',
      editTitle: 'Titel bearbeiten',
      save: 'Speichern',
      cancel: 'Abbrechen',
      productLabel: 'Produkt',
      placeholder: 'z. B. Butter',
      addButton: 'Hinzufügen',
      loading: 'Lade Einträge...',
      empty: 'Noch keine Produkte. Füge dein erstes hinzu!',
      dragToSort: 'Ziehen zum Sortieren',
      itemBought: (name) => `${name} gekauft`,
      decreaseQuantity: (name) => `${name} Anzahl verringern`,
      increaseQuantity: (name) => `${name} Anzahl erhöhen`,
      deleteItem: (name) => `${name} löschen`,
      reorderItem: (name) => `${name} verschieben`,
      quantityOf: (name) => `Anzahl von ${name}`,
    }
  : {
      title: 'Shopping list',
      subtitle: 'What do you need today?',
      titleLabel: 'List name',
      editTitle: 'Edit title',
      save: 'Save',
      cancel: 'Cancel',
      productLabel: 'Product',
      placeholder: 'e.g. butter',
      addButton: 'Add',
      loading: 'Loading items...',
      empty: 'No products yet. Add your first one!',
      dragToSort: 'Drag to reorder',
      itemBought: (name) => `${name} bought`,
      decreaseQuantity: (name) => `Decrease ${name}`,
      increaseQuantity: (name) => `Increase ${name}`,
      deleteItem: (name) => `Delete ${name}`,
      reorderItem: (name) => `Reorder ${name}`,
      quantityOf: (name) => `Quantity of ${name}`,
    };
