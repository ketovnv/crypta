import { makeAutoObservable, runInAction } from "mobx";

/**
 * MobX store for managing list items in ScrollList component
 */
class ListItemsStore {
  // Observable state
  items = [];
  selectedIndex = -1;

  constructor() {
    makeAutoObservable(this);
  }

  // Actions

  /**
   * Get the currently selected item
   */
  get selectedItem() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.items.length) {
      return this.items[this.selectedIndex];
    }
    return null;
  }

  /**
   * Add a new item to the beginning of the list
   * @param {any} item - The item to add
   */
  addItem(item) {
    runInAction(() => {
      this.items.unshift(item);
    });
  }

  /**
   * Add a new item at a specific index
   * @param {any} item - The item to add
   * @param {number} index - The index at which to add the item
   */
  addItemAt(item, index) {
    runInAction(() => {
      this.items.splice(index, 0, item);
    });
  }

  /**
   * Remove an item at a specific index
   * @param {number} index - The index of the item to remove
   */
  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      runInAction(() => {
        this.items.splice(index, 1);
      });
    }
  }

  /**
   * Set the selected index
   * @param {number} index
   */
  setSelectedIndex(index) {
    this.selectedIndex = index;
  }

  /**
   * Clear all items
   */
  clearItems() {
    this.items = [];
  }

  /**
   * Set entire items array
   * @param {Array} newItems
   */
  setItems(newItems) {
    this.items = [...newItems];
  }
}

export const listItemsStore = new ListItemsStore();
