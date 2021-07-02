import SpotifyWebApi from 'spotify-web-api-js';
import React from 'react';

const spotifyApi = new SpotifyWebApi();

interface Props {
    loadUser: () => void
    authorize: () => void
    error: (error: SpotifyWebApi.ErrorObject) => void
}

interface State {
    me?: SpotifyApi.UserObjectPrivate
}

export class AccountLabel extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { me: undefined };
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
        if (this.state.me === undefined) {
            return <button className="" onClick={this.props.authorize}>Authorize</button>;
        }
        if (this.state.me.images !== undefined) {
            var image: any = <img className='object-contain h-full' src={this.state.me.images[0].url} alt="profile" />
        }
        return <button className='flex items-center p-0 headerButton' onClick={this.props.loadUser}>
            {image}
            <div className="px-2 hidden 2xl:inline">{this.state.me.display_name}</div>
        </button>;
    }
}

export default AccountLabel;