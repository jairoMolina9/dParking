import React from 'react';
import QRCode from 'qrcode.react';


export default function Qrcode(props) {
    return (
        <QRCode value={window.location.host + "/" + props.userId} />
    )
}
