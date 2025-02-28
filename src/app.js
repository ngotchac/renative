import React from 'react';
import { createApp } from 'renative';
import { navStructure } from './nav';
import Fonts from '../platformAssets/runtime/fontManager';
import ScreenHome from './screenHome';
import ScreenMyPage from './screenMyPage';
import ScreenModal from './screenModal';
import Menu from './menu';

let AppContainer;

class App extends React.Component {
    constructor(props) {
        super(props);
        AppContainer = createApp(navStructure, { ScreenHome, ScreenMyPage, ScreenModal, Menu });
    }

    render() {
        return AppContainer;
    }
}

export default App;
