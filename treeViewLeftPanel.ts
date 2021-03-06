/// <reference path="../../js/jquery.d.ts" />

import basePanel = require("../coreplayer-treeviewleftpanel-module/treeViewLeftPanel");
import utils = require("../../utils");
import tree = require("../coreplayer-treeviewleftpanel-module/treeView");
import journalSortType = require("../../extensions/wellcomeplayer-seadragon-extension/journalSortType");

export class TreeViewLeftPanel extends basePanel.TreeViewLeftPanel {

    $treeViewOptions: JQuery;
    $sortByLabel: JQuery;
    $buttonGroup: JQuery;
    $sortByDateButton: JQuery;
    $sortByVolumeButton: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('treeViewLeftPanel');

        super.create();

        this.$treeViewOptions = $('<div class="treeView"></div>');
        this.$options.append(this.$treeViewOptions);

        this.$sortByLabel = $('<span class="sort">Sort By:</span>');
        this.$treeViewOptions.append(this.$sortByLabel);

        this.$buttonGroup = $('<div class="btn-group"></div>');
        this.$treeViewOptions.append(this.$buttonGroup);

        this.$sortByDateButton = $('<button class="btn">' + this.content.date + '</button>');
        this.$buttonGroup.append(this.$sortByDateButton);

        this.$sortByVolumeButton = $('<button class="btn">' + this.content.volume + '</button>');
        this.$buttonGroup.append(this.$sortByVolumeButton);

//        this.$sortList = $('<select>\
//                                <option value="date">Date</option>\
//                                <option value="volume">Volume</option>\
//                            </select>');
//
//        this.$treeViewOptions.append(this.$sortList);

//        var that = this;

        // events
//        this.$sortList.on('change', function(e) {
//            var val = $(this).find('option:selected').val();
//
//            switch(val){
//                case "date":
//                    that.treeView.rootNode = that.provider.getJournalTree(journalSortType.JournalSortType.date);
//                    break;
//                case "volume":
//                    that.treeView.rootNode = that.provider.getJournalTree(journalSortType.JournalSortType.volume);
//                    break;
//            }
//
//            that.treeView.dataBind();
//            that.selectCurrentTreeNode();
//        });

        this.$sortByDateButton.on('click', () => {
            this.sortByDate();
        });

        this.$sortByVolumeButton.on('click', () => {
            this.sortByVolume();
        });

        this.$treeViewOptions.hide();
    }

    createTreeView(): void {

        this.treeView = new tree.TreeView(this.$treeView);

        this.updateTreeView();
        this.updateTreeViewOptions();
    }

    sortByDate(): void {
        this.treeView.rootNode = this.provider.getJournalTree(journalSortType.JournalSortType.date);
        this.treeView.dataBind();
        this.selectCurrentTreeNode();
        this.$sortByDateButton.addClass('on');
        this.$sortByVolumeButton.removeClass('on');
    }

    sortByVolume(): void {
        this.treeView.rootNode = this.provider.getJournalTree(journalSortType.JournalSortType.volume);
        this.treeView.dataBind();
        this.selectCurrentTreeNode();
        this.$sortByDateButton.removeClass('on');
        this.$sortByVolumeButton.addClass('on');
    }

    updateTreeView(): void {
        if (this.isPeriodical()){
            this.sortByDate();
        } else {
            this.treeView.rootNode = this.provider.getTree();
            this.treeView.dataBind();
        }
    }

    isPeriodical(): boolean{
        var manifestType = this.provider.getManifestType();
        return manifestType.toLowerCase() === "periodicalissue";
    }

    updateTreeViewOptions(): void{
        if (this.isPeriodical()){
            this.$treeViewOptions.show();
        } else {
            this.$treeViewOptions.hide();
        }
    }

    openTreeView(): void{

        var that = this;

        this.updateTreeViewOptions();

        setTimeout(() => {
            that.selectCurrentTreeNode();
        }, 1);

        super.resize();
        super.openTreeView();
    }

    openThumbsView(): void{

        this.$treeViewOptions.hide();
        super.resize();
        super.openThumbsView();
    }

    selectCurrentTreeNode(): void{
        // get the manifest structure
        var structure = this.provider.sequence.structure;
        if (!structure) return;
        if (this.treeView && structure.treeNode) this.treeView.selectNode(structure.treeNode);
    }

    selectTreeNodeFromCanvasIndex(index: number): void {
        // may be authenticating
        if (index == -1) return;

        if (this.isPeriodical()){
            this.selectCurrentTreeNode();
        } else {
            super.selectTreeNodeFromCanvasIndex(index);
        }
    }
}