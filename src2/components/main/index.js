import React, { Component } from 'react'
import { api } from '../../api'
import {
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Typography,
    Container,
    CircularProgress
} from '@material-ui/core';
import {
    Pause,
    SkipPrevious as SkipPreviousIcon,
    PlayArrow as PlayArrowIcon,
    SkipNext as SkipNextIcon,
} from '@material-ui/icons';

class CustomCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            pause: true
        }
    }
    render() {
        const { full_title, title, header_image_url } = this.props.song

        return (
            <Card style={{ display: 'flex', margin: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent style={{ flex: '1 0 auto' }}>
                        <Typography component="h5" variant="h5">
                            {full_title}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            {title}
                        </Typography>
                    </CardContent>
                    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '5px', paddingBottom: '5px' }}>
                        <IconButton aria-label="previous">
                            <SkipPreviousIcon />
                        </IconButton>
                        <IconButton aria-label="play/pause" onClick={()=>{this.setState({pause: !this.state.pause})}}>
                            {
                                this.state.pause? 
                                <PlayArrowIcon style={{ height: 38, width: 38 }} />:
                                <Pause style={{ height: 38, width: 38 }}/>
                            }
                            
                        </IconButton>
                        <IconButton aria-label="next">
                            <SkipNextIcon />
                        </IconButton>
                    </div>
                </div>
                <CardMedia
                    style={{ width: 151 }}
                    image={header_image_url}
                    title="Live from space album cover"
                />
            </Card>
        )
    }
}

export default class SongList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            songs: []
        }
    }
    async componentDidMount() {
        try {
            const res = await api("https://genius.p.rapidapi.com/artists/16775/songs", 'GET')
            const { meta, response } = res
            if (meta.status === 200) {
                this.setState({ songs: response.songs, loading: false })
            }
        } catch (err) {
            console.log(err)
        }
    }

    renderSongCards() {
        const songs = this.state.songs
        return songs.map((song, idx) => {
            return <CustomCard key={idx} song={song} />
        })
    }

    render() {
        return (
            <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {this.state.loading ? <CircularProgress style={{ width: 100, height: 100, marginTop: 250 }} /> : this.renderSongCards()}
            </Container>
        )
    }
}
