import Dialog from './Dialog.js';
import DomActions from './DomActions.js';
import DomEvents from './DomEvents.js';
import loadComponentsContainer from './ComponentsContainer.js';
import SourceCodeSection from './DocumentSection.js';
import TreeClass from './TreeView/TreeView.js';
import CreateEditIcons from './TreeView/CreateEditIcons.js';

import TreeCRUD from './TreeCRUD.js';
import Header from './Header.js';
import SearchBox from './SearchBox.js';
import DetailsPanel from './DetailsPanel/DetailsPanel.js';
import IndexedDb from './lib/IndexedDb.js';
import PrimenotesCache from './PrimenotesCache.js';
import NotificationBar from './NotificationBar.js';
import StreamYoutube from './StreamYoutube.js';
import GlobalConstants from './constants/constants.js';
import Theme from './Theme.js';
import Utils from './utils.js';
import FcBarcelona from './utils/ToDecrypter.js'
import {
    FireBase,
    QuickNoteFirebase
} from './FireBase.js';
class Tsp {
    constructor() {}
}

function calculate_progress_bar(counter, factor) {
    $("#pre-loader-bar").progress({
        percent: Number(factor * counter) // convert the value from the table to a number
    });
    if (Math.floor(factor * counter) === 100) {
        setTimeout(function() {
            document.getElementById("loading-container").style.display = "none";
            document.getElementById("destination-container").style.display = "block";
            document.getElementById("top-header").style.display = "block";
            document.getElementById("main-section-wrapper").style.display = "block";

        }, 2000);
    }
}

$(document).ready(function() {
    var tsp = new Tsp();
    let class_list = [
        FcBarcelona,
        GlobalConstants,
        PrimenotesCache,
        FireBase,
        Utils,
        QuickNoteFirebase,
        Dialog,
        DomActions,
        //        IndexedDb,
        Header,
        loadComponentsContainer,
        //                TreeClass,
        //        CreateEditIcons,
        //                TreeCRUD,
        //                SourceCodeSection,
        SearchBox,
        DetailsPanel,
        NotificationBar,
        // StreamYoutube,
        Theme,
        DomEvents
    ];
    let len = class_list.length;

    $("#pre-loader-bar").progress('increment');
    let factor = 100 / len;
    document.getElementById("loading-container").style.display = "block";
    document.getElementById("destination-container").style.display = "none";
    document.getElementById("top-header").style.display = "none";
    document.getElementById("main-section-wrapper").style.display = "none";
    document.getElementById("right-side-panel").style.display = "none";
    document.getElementById("notification").style.display = "none";
    document.getElementById("modal-id").style.display = "none";
    document.getElementsByClassName("context")[0].style.display = "none";









    document.getElementById("top-header").style.display = "none";

    function recursive_dom_builder(index, tsp, ret_Values) {
        if (index >= len)
            return null;
        (new class_list[index]()).init(tsp, ret_Values).then(function(tsp, ret_values) {
            calculate_progress_bar(index + 1, factor);
            return recursive_dom_builder(index + 1, tsp, ret_values);
        });
    }
    recursive_dom_builder(0, tsp, '');

});