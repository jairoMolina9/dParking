import React from 'react';
import QRCode from 'qrcode.react';
import { Modal, Button } from 'antd';


export default function Qrcode(props) {
    return (
        <div>
        <Button type="primary" onClick={props.showModal}>
          My QRcode
        </Button>
        <Modal
          title="My QRcode"
          visible={props.visibleQR}
          onOk={props.handleOkQR}
          onCancel={props.handleCancelQR}
        >
          <QRCode value={window.location.host + "/" + props.userId} />
        </Modal>
      </div>
        
    )
}
