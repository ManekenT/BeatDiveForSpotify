import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';

const spotifyApi = new SpotifyWebApi();

export class AccountLabel extends React.Component {

    constructor(props) {
        super(props);
        this.state = { me: '' };
    }

    componentDidMount() {
        spotifyApi.getMe({},
            (error, me) => {
                if (error) {
                    this.props.error(error);
                } else {
                    this.setState({
                        me: me
                    });
                }
            }
        );
    }

    render() {
        if (this.state.me !== '') {
            return <button id="accountLabel" onClick={this.props.loadUser}>
                <img id="accountImage" src={this.state.me.images[0].url} alt="profile" />
                <div id="accountName">{this.state.me.display_name}</div>
            </button>
        } else {
            return <button className="item" onClick={this.props.authorize}>Authorize</button>;
        }
    }
}

export default AccountLabel;