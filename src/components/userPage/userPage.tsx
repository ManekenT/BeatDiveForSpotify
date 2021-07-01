import SpotifyWebApi from 'spotify-web-api-js';
import { useEffect, useState } from 'react';
import ContentHeader from '../../container/contentHeader/contentHeader';
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
        spotifyApi.getUser(props.match.params.id, {}, (error, user) => {
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
    }
    return <div className="contentContainer">
        <ContentHeader title={user.display_name} imageUrl={imageUrl} contentType="User" />
    </div >;
}

export default withRouter(UserPage);