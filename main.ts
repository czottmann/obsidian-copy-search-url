import { Notice, Plugin, setIcon } from "obsidian";
import { SearchLeafView } from "./types";

export default class CopySearchUrl extends Plugin {
  button: HTMLDivElement;

  async onload() {
    this.app.workspace.onLayoutReady(() => {
      if (this.isSearchDisabled()) {
        new Notice(
          "Core search plugin is disabled, can't set up Copy Search URL plugin! Please enable core Search plugin and reload.",
        );
        return;
      }

      this.createCopyUrlButton();
      this.addButtonToSearchNavigation();
      this.addButtonClickListener();
    });
  }

  onunload() {
    if (this.isSearchDisabled()) {
      return;
    }

    this.removeCopyUrlButton();
  }

  private createCopyUrlButton() {
    this.button = document.createElement("div");
    this.button.setAttribute("class", "clickable-icon nav-action-button");
    this.button.setAttribute("aria-label", "Copy Obsidian search URL");
    setIcon(this.button, "link");
  }

  private addButtonToSearchNavigation() {
    const searchNavHeader = this.getSearchLeaf().view.containerEl.children[0];
    searchNavHeader.children[0].appendChild(this.button);
  }

  private addButtonClickListener() {
    this.registerDomEvent(this.button, "click", async (evt: MouseEvent) => {
      if (this.getSearchQuery() === "") {
        return;
      }

      await navigator.clipboard.writeText(this.getObsidianUrl());
      new Notice("Obsidian search URL copied!");
    });
  }

  private removeCopyUrlButton() {
    this.button?.detach();
  }

  private isSearchDisabled() {
    return this.getSearchLeaf() === undefined;
  }

  private getSearchLeaf() {
    return this.app.workspace.getLeavesOfType("search")[0];
  }

  private getSearchQuery() {
    return (<SearchLeafView> this.getSearchLeaf().view)?.getQuery() || "";
  }

  private getObsidianUrl() {
    const query = encodeURIComponent(this.getSearchQuery());
    const vault = encodeURIComponent(this.app.vault.getName());
    return `obsidian://search?vault=${vault}&query=${query}`;
  }
}
