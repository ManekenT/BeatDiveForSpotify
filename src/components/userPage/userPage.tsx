import SpotifyWebApi from 'spotify-web-api-js';
import { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const spotifyApi = new SpotifyWebApi();

interface Params {
    id: string
}

interface Props extends RouteComponentProps<Params> {
    error: (error: SpotifyWebApi.ErrorObject) => void
    imageLoaded: (imageUrl: string) => void
}

function UserPage(props: Props) {

    const [user, setUser] = useState<SpotifyApi.UserObjectPublic>();

    useEffect(() => {
        spotifyApi.getMe((error: SpotifyWebApi.ErrorObject, user: SpotifyApi.UserObjectPrivate) => {
            if (error) {
                props.error(error);
                return;
            }
            if (user.images) {
                props.imageLoaded(user.images[0].url);
            }
            setUser(user);
        });
    }, [props]);
    if (user === undefined) {
        return null;
    }
    let imageUrl = undefined;
    if (user.images !== undefined) {
        imageUrl = user.images[0].url;
        imageUrl = imageUrl;
    }
    return null;
}

export default withRouter(UserPage);