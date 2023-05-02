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

      this.registerEvent(
        this.app.workspace.on("search:results-menu", (menu, file) => {
          menu.addItem((item) => {
            item
              .setTitle("Copy Obsidian search URL")
              .setIcon("link")
              .onClick(async () => {
                if (this.getSearchQuery() === "") {
                  return;
                }

                await navigator.clipboard.writeText(this.getObsidianUrl());
                new Notice("Obsidian search URL copied!");
              });
          });
        }),
      );
    });
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
