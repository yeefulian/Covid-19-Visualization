import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps"
import { Modal, Card, CardHeader, CardContent, CardMedia, IconButton, Typography, Divider, CardActions, CircularProgress } from '@material-ui/core';
import { Close, Favorite, Update, LocalHospital, FormatColorReset, FolderOpen } from '@material-ui/icons';
import moment from 'moment';
import { api } from './api'


var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0xec, b: 0xe5 } },
    { pct: 0.025, color: { r: 0xff, g: 0xd9, b: 0xcc } },
    { pct: 0.05, color: { r: 0xff, g: 0xc7, b: 0xb2 } },
    { pct: 0.075, color: { r: 0xff, g: 0xb4, b: 0x99 } },
    { pct: 0.1, color: { r: 0xff, g: 0xa2, b: 0x7f } },
    { pct: 0.125, color: { r: 0xff, g: 0x8f, b: 0x66 } },
    { pct: 0.15, color: { r: 0xff, g: 0x7c, b: 0x4c } },
    { pct: 0.175, color: { r: 0xff, g: 0x6a, b: 0x32 } },
    { pct: 0.2, color: { r: 0xff, g: 0x57, b: 0x19 } },
    { pct: 0.225, color: { r: 0xff, g: 0x45, b: 0 } },
    { pct: 0.25, color: { r: 0xe5, g: 0x3e, b: 0 } },
    { pct: 0.275, color: { r: 0xcc, g: 0x37, b: 0 } },
    { pct: 0.3, color: { r: 0xb2, g: 0x30, b: 0 } },
    { pct: 0.325, color: { r: 0x99, g: 0x29, b: 0 } },
    { pct: 0.35, color: { r: 0x7f, g: 0x22, b: 0 } },
    { pct: 0.375, color: { r: 0x66, g: 0x1b, b: 0 } },
    { pct: 0.4, color: { r: 0x4c, g: 0x14, b: 0 } },
    { pct: 0.425, color: { r: 0x33, g: 0x0d, b: 0 } },
    { pct: 0.45, color: { r: 0x19, g: 0x06, b: 0 } },
];

var getColorForPercentage = function (pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"


const style = {
    modal: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 150,
        alignItems: 'center'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '25%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 5
    },
    close: {
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    textColor: {
        color: 'white'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
    },
    icon: {
        color: 'white',
        width: 35,
        height: 35,
        paddingRight: 30,
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modelOpen: false,
            loading: true,
            globalSummary: null,
            countriesSummary: [],
            top10Countries: [],
            selectedCountry: null,
            hideLegend: true,
            hideGlobalSummary: true,
            hideTopCountry: true,
            hideTime: false,
            currentTime: moment().toLocaleString(),
            lastUpdate: moment().toLocaleString(),
        }
    }


    async componentDidMount() {
        this.timerID = setInterval(() => {
            this.setState({
                currentTime: moment().toLocaleString()
            })
        }, 1000)

        try {
            const res = await api("https://api.covid19api.com/summary", "GET")
            const sortedCountries = res.Countries.sort((a, b) => {
                if (a.TotalConfirmed > b.TotalConfirmed) return -1;
                if (b.TotalConfirmed > a.TotalConfirmed) return 1;
                return 0;
            })
            const top10Countries = sortedCountries.slice(0, 5)
            this.setState({
                countriesSummary: res.Countries,
                selectedCountry: res.Countries[0],
                globalSummary: res.Global,
                lastUpdate: moment().toLocaleString(),
                loading: false,
                top10Countries
            })
        } catch (err) {
            // window.location.reload(false)
        }

        this.fetchID = setInterval(async () => {
            try {
                const res = await api("https://api.covid19api.com/summary", "GET")
                const sortedCountries = res.Countries.sort((a, b) => {
                    if (a.TotalConfirmed > b.TotalConfirmed) return -1;
                    if (b.TotalConfirmed > a.TotalConfirmed) return 1;
                    return 0;
                })
                const top10Countries = sortedCountries.slice(0, 5)
                this.setState({
                    countriesSummary: res.Countries,
                    selectedCountry: res.Countries[0],
                    globalSummary: res.Global,
                    lastUpdate: moment().toLocaleString(),
                    loading: false,
                    top10Countries
                })
            } catch (err) {
                // window.location.reload(false)
            }
        }, 300000)
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
        clearInterval(this.fetchID)
    }

    searchCountry = (countryCode) => {
        const countriesSummary = this.state.countriesSummary
        const idx = countriesSummary.findIndex((countryCase) => countryCase.CountryCode === countryCode)
        return countriesSummary[idx]
    }

    openModel(countryCode) {
        this.setState({
            modelOpen: true,
            selectedCountry: this.searchCountry(countryCode)
        })
    }

    closeModel() {
        this.setState({
            modelOpen: false,
        })
    }

    renderModal = () => {
        const { TotalConfirmed, TotalDeaths, TotalRecovered, CountryCode, Country } = this.state.selectedCountry
        return (
            <Modal
                style={style.modal}
                open={this.state.modelOpen}
                onClose={() => { this.closeModel() }}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Card style={style.container}>
                    <div style={style.close}>
                        <IconButton onClick={() => { this.closeModel() }}>
                            <Close style={{ color: 'white', width: 20, height: 20 }} />
                        </IconButton>
                    </div>
                    <div style={{ padding: 20, paddingBottom: 0, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                            style={{ width: 60, height: 'auto', flex: 1 }}
                            src={`https://www.countryflags.io/${CountryCode.toLowerCase()}/flat/64.png`}
                        />
                        <Typography align={'center'} style={{ ...style.textColor, flex: 1, fontWeight: 'bold', flex: 1.5 }} component="h5" variant="h5">
                            {Country}
                        </Typography>
                    </div>

                    <CardContent style={style.content}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <LocalHospital style={style.icon} />
                                <div style={{ display: 'flex', flexDirection: 'column', }}>
                                    <Typography style={style.textColor}>
                                        Total Cases
                                    </Typography>
                                    <Typography style={{ fontSize: 24, fontWeight: 'bold' }} color={'error'}>
                                        {numberWithCommas(TotalConfirmed)}
                                    </Typography>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <FormatColorReset style={style.icon} />
                                <div style={{ display: 'flex', flexDirection: 'column', }}>
                                    <Typography style={style.textColor}>
                                        Total Deaths
                                    </Typography>
                                    <Typography style={{ fontSize: 24, fontWeight: 'bold' }} color={'error'}>
                                        {numberWithCommas(TotalDeaths)}
                                    </Typography>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                <Favorite style={style.icon} />
                                <div style={{ display: 'flex', flexDirection: 'column', }}>
                                    <Typography style={style.textColor}>
                                        Total Recovered
                                    </Typography>
                                    <Typography style={{ fontSize: 24, fontWeight: 'bold', }} color={'error'}>
                                        {numberWithCommas(TotalRecovered)}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        {/* <div style={{ display: 'flex', flexDirection: 'column', flex: 1.5, marginLeft: 10 }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Update style={{ color: 'white', width: 30, height: 30, paddingRight: 10 }} />
                                <Typography style={style.textColor} variant="subtitle1">
                                    Last Update
                                </Typography>
                            </div>
                            <Typography align={'center'} style={{ color: 'rgba(190, 190, 190)', fontSize: 14 }}>
                                {moment(this.state.selectedCountry.Date).toLocaleString()}
                            </Typography>
                        </div> */}
                    </CardContent>
                </Card>
            </Modal>
        )
    }

    renderGlobalSummary = () => {
        const { TotalConfirmed, TotalDeaths, TotalRecovered } = this.state.globalSummary
        return (
            this.state.loading ? null :
                <Card style={{ width: '15%', position: 'fixed', bottom: '29%', left: '1%' }}>
                    <CardHeader
                        title={"Global Summary"}
                        action={
                            <React.Fragment>
                                <IconButton onClick={() => { this.setState({ hideGlobalSummary: false }) }}>
                                    <FolderOpen />
                                </IconButton>
                                <IconButton onClick={() => { this.setState({ hideGlobalSummary: true }) }}>
                                    <Close />
                                </IconButton>
                            </React.Fragment>
                        }
                    />
                    {
                        this.state.hideGlobalSummary ?
                            null :
                            <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <LocalHospital style={{ ...style.icon, color: 'black' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', }}>
                                        <Typography style={{ fontWeigth: 'bold' }}>
                                            Total Cases
                                    </Typography>
                                        <Typography style={{ fontSize: 24, fontWeight: 'bold' }} color={'error'}>
                                            {numberWithCommas(TotalConfirmed)}
                                        </Typography>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <FormatColorReset style={{ ...style.icon, color: 'black' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', }}>
                                        <Typography style={{ fontWeigth: 'bold' }}>
                                            Total Deaths
                                    </Typography>
                                        <Typography style={{ fontSize: 24, fontWeight: 'bold' }} color={'error'}>
                                            {numberWithCommas(TotalDeaths)}
                                        </Typography>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Favorite style={{ ...style.icon, color: 'black' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', }}>
                                        <Typography style={{ fontWeigth: 'bold' }}>
                                            Total Recovered
                                        </Typography>
                                        <Typography style={{ fontSize: 24, fontWeight: 'bold', }} color={'error'}>
                                            {numberWithCommas(TotalRecovered)}
                                        </Typography>
                                    </div>
                                </div>
                            </CardContent>
                    }
                </Card>
        )
    }

    renderTopCountry = () => {
        return (
            this.state.loading ? null :
                <Card style={{ width: '15%', position: 'fixed', bottom: '15%', left: '1%' }}>
                    <CardHeader
                        title={"Top 5 Countries"}
                        action={
                            <React.Fragment>
                                <IconButton onClick={() => { this.setState({ hideTopCountry: false }) }}>
                                    <FolderOpen />
                                </IconButton>
                                <IconButton onClick={() => { this.setState({ hideTopCountry: true }) }}>
                                    <Close />
                                </IconButton>
                            </React.Fragment>
                        }
                    />
                    {
                        this.state.hideTopCountry ?
                            null :
                            <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                                {
                                    this.state.top10Countries.map((country, idx) => {
                                        return (
                                            <React.Fragment>
                                                <div key={idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <img
                                                        style={{ width: 60, height: 'auto' }}
                                                        src={`https://www.countryflags.io/${country.CountryCode.toLowerCase()}/flat/64.png`}
                                                    />
                                                    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 15 }}>
                                                        <Typography style={{ fontWeight: 'bold' }}>
                                                            {country.Country}
                                                        </Typography>
                                                        <Typography style={{ fontSize: 24, fontWeight: 'bold' }} color={'error'}>
                                                            {numberWithCommas(country.TotalConfirmed)}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                <Divider style={{marginTop: 5, marginBottom: idx === 4? 0 : 5}}/>
                                            </React.Fragment>
                                        )
                                    })
                                }

                            </CardContent>
                    }
                </Card>
        )
    }

    renderLegend = () => {
        const reversedPercentColors = percentColors.slice().reverse()
        return (
            this.state.loading ? null :
                <Card style={{ width: '15%', position: 'fixed', bottom: '1.5%', left: '1%' }}>
                    <CardHeader
                        title={"Color Legend"}
                        action={
                            <React.Fragment>
                                <IconButton onClick={() => { this.setState({ hideLegend: false }) }}>
                                    <FolderOpen />
                                </IconButton>
                                <IconButton onClick={() => { this.setState({ hideLegend: true }) }}>
                                    <Close />
                                </IconButton>
                            </React.Fragment>
                        }
                    />
                    {
                        this.state.hideLegend ?
                            null :
                            <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
                                {
                                    reversedPercentColors.map((percentColor, idx) => {
                                        const { pct, color } = percentColor;
                                        const globalCase = this.state.globalSummary.TotalConfirmed
                                        const cases = Math.floor(pct * globalCase)
                                        const rgb = 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
                                        return (
                                            <div key={idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <div style={{ width: 25, height: 25, backgroundColor: rgb }}></div>
                                                <Typography align={'right'} style={{ fontWeight: 'bold', paddingLeft: 20, fontSize: 20 }}>
                                                    {`${idx === reversedPercentColors.length - 1 ? ">" : "<"}= ${idx === reversedPercentColors.length - 1 ? 1 : numberWithCommas(cases)}`}
                                                </Typography>
                                            </div>
                                        )
                                    })
                                }
                            </CardContent>
                    }

                </Card>
        )
    }

    render() {
        return (
            <React.Fragment>
                <Card style={{ position: 'absolute', right: '0.5%', top: '2%', backgroundColor: 'rgba(0, 0, 0, 0.7)', }}>
                    <CardActions style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <IconButton style={{ color: 'white' }} onClick={() => { this.setState({ hideTime: true }) }}>
                            <Close />
                        </IconButton>
                        <IconButton style={{ color: 'white' }} onClick={() => { this.setState({ hideTime: false }) }}>
                            <FolderOpen />
                        </IconButton>

                    </CardActions>
                    {
                        this.state.hideTime ? null :
                            <CardContent style={{ color: 'rgba(256, 256, 256, 0.9)' }}>
                                <Typography variant={'h6'} style={{ fontWeight: 'bold', fontSize: 18 }}>
                                    {this.state.currentTime}
                                </Typography>
                                <Typography align={'right'} style={{ fontSize: 16, fontWeight: 'bold', }}>
                                    Update Every 5 Min
                        </Typography>
                                <Divider light={true} style={{ color: 'white', marginTop: 10, marginBottom: 10 }} />
                                <Typography align={'right'} style={{ fontSize: 16, fontWeight: 'bold', }}>
                                    Last Update On
                        </Typography>
                                <Typography align={'right'} style={{ fontSize: 14, fontWeight: 'bold', }}>
                                    {this.state.lastUpdate}
                                </Typography>
                            </CardContent>
                    }

                </Card>

                {this.state.loading ? null : this.renderGlobalSummary()}
                {this.state.loading ? null : this.renderTopCountry()}
                {this.renderLegend()}
                <div>
                    {
                        this.state.loading ?
                            <div style={{ marginTop: '15%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
                                <CircularProgress size={80} />
                                <Typography variant={'h6'} align={'center'} style={{ marginTop: '20px', fontWeight: 'bold', fontStyle: 'italic' }}>
                                    Fetching Covid 19 Data
                                </Typography>
                            </div> :
                            <ComposableMap width={900} height={470}>
                                <Geographies geography={geoUrl}>
                                    {({ geographies }) => geographies.map(geo => {
                                        let percentage = null;
                                        const countrySummary = this.searchCountry(geo.properties.ISO_A2)
                                        if (countrySummary !== undefined && this.state.globalSummary !== undefined) {
                                            percentage = countrySummary.TotalConfirmed / this.state.globalSummary.TotalConfirmed
                                        }
                                        return <Geography
                                            fill={percentage === null || percentage === 0 ? 'white' : getColorForPercentage(percentage)}
                                            stroke={'black'}
                                            onClick={percentage === null ? null : () => { this.openModel(geo.properties.ISO_A2) }}
                                            key={geo.rsmKey}
                                            geography={geo} />
                                    })}
                                </Geographies>
                            </ComposableMap>
                    }

                    {this.state.loading ? null : this.renderModal()}
                </div>
            </React.Fragment>

        )
    }
}

ReactDom.render(
    <App />,
    document.getElementById('root')
)