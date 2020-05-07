import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SongList from './components/main'
import { AppBar, Toolbar, Typography, IconButton, InputBase, Button, Drawer, Divider, Avatar } from '@material-ui/core';
import { Person, Settings, Search, Menu, LibraryMusic, Favorite, Info, Notifications } from '@material-ui/icons';

const style = {
    anchorStyle:{
        width: 30, 
        height: 30, 
        paddingRight: 20
    }
}

class ButtonAppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    renderDrawerAnchors({top}) {
        const aboveAnchors = [
            {
                icon: <Person style={style.anchorStyle}/>,
                name: "Account"
            },
            {
                icon: <LibraryMusic style={style.anchorStyle}/>,
                name: "Libray Music"
            },
            {
                icon: <Favorite style={style.anchorStyle}/>,
                name: "Favorite"
            },
            {
                icon: <Notifications style={style.anchorStyle}/>,
                name: "Notification"
            },
            {
                icon: <Settings style={style.anchorStyle}/>,
                name: "Settings"
            },
        ]

        const belowAnchors = [
            {
                icon: <Info style={style.anchorStyle}/>,
                name: "About"
            },
        ]

        const anchors = top? aboveAnchors : belowAnchors;

        return anchors.map((anchor, idx) => {
            return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'row', marginTop: 20, marginLeft: 30, marginRight: 100, }}>
                    {anchor.icon}
                    <Typography style={{alignSelf: 'center'}}>
                        {anchor.name}
                    </Typography>
                </div>
            )

        })
    }

    renderDrawer() {
        return (
            <Drawer anchor={"left"} open={this.state.open} onClose={() => { this.setState({ open: false }) }}>
                <div style={{ margin: 30, marginTop: 50, display: 'flex', flexDirection: 'row' }}>
                    <Avatar style={{backgroundColor: 'grey'}}>
                        YL
                    </Avatar>
                    <Typography variant="h6" style={{alignSelf: 'center', paddingLeft: 20 }}>
                        YeeFu Lian
                    </Typography>
                </div>
                {this.renderDrawerAnchors({top: true})}
                <Divider style={{margin: 30}}/>
                {this.renderDrawerAnchors({top: false})}
            </Drawer>
        )
    }

    render() {
        return (
            <div style={{ flexGrow: 1 }}>
                {this.renderDrawer()}
                <AppBar position="static">
                    <Toolbar>
                        <IconButton onClick={() => { this.setState({ open: true }) }} edge="start" style={{ paddingRight: 20 }} color="inherit" aria-label="menu">
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" style={{ flewGrow: 1 }}>
                            Song Lists
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

ReactDOM.render(
    <React.Fragment>
        <ButtonAppBar />
        <SongList />
    </React.Fragment>,
    document.getElementById('root'),
);
