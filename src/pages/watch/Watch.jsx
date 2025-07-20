import './watch.scss'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Watch() {
    return (
        <div className="watch">
            <div className="back">
                <ArrowBackIcon/>
                Home
            </div>
            <video className="video" autoPlay="true" progress controls src="https://media.istockphoto.com/videos/timelapse-sun-beams-shining-through-moving-dramatic-white-clouds-hope-video-id1176865804"/>
        </div>
    )
}
