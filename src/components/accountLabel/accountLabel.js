import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';

const spotifyApi = new SpotifyWebApi();

export class AccountLabel extends React.Component {

    constructor(props) {
        super(props);
        this.state = { me: '' };
    }

    componentDidMount() {
        console.log("mounted image");
        spotifyApi.getMe({},
            (error, me) => {
                if (error) {
                    //handleApiError(error);
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
            console.log(this.state.me);
            return <div id="accountLabel">
                <img id="accountImage" src={this.state.me.images[0].url} />
                <div id="accountName">{this.state.me.display_name}</div>
            </div>
        } else {
            return <button className="item" onClick={this.props.authorize}>Authorize</button>;
        }
    }
}

export default AccountLabel;