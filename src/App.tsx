import { useState } from 'react';
import './App.css';
import Game from './pages/Game';
import Menu from './pages/Menu';
import * as blackjack from './utils/blackjack-react';

export default function App() {
    const [page, setPage] = useState('menu');
    const [settings, setSettings] = useState({
        hasDealer: true,
        userCount: 2
    });
    const [users, setUsers] = useState([[]]);

    /**
     * Changes the app page to a different one such as main menu, game, or settings.
     * @param {string} str - The page to change to.
     */
    function alterPage (str: string) {
        str = str.trim().toLowerCase();
        const validPages = ['menu', 'settings', 'game'];
        if (!validPages.includes(str)) {
            throw new Error(`alterPage() did not find a page called ${str}.  Valid pages are ${validPages.join(', ')}.`);
        }
        if (str === 'game') {
            blackjack.init({setUsers, userCount: settings.userCount});
        }
        setPage(str);
    }

    function alterSettings (obj: any) {
        setSettings((settings: any) => ({...settings, ...obj}));
    }

    function getPage () {
        switch (page) {
            case 'menu':
                return <Menu {...{alterPage, alterSettings}}/>;
                break;
            case 'settings':
                return <div></div>;
                break;
            case 'game':
                return <Game {...{alterPage, settings, users, setUsers}}/>;
                break;
        }
    }

    return <main id={page}>{getPage()}</main>
}
