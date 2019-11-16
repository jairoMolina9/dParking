// shows the validity of the parking
// TODO
import React from 'react'
import { Card } from 'antd';

export default function ValidParking(props) {
    console.log(props.transactions);
    return (
        <div>
    {props.transactions.map((transaction) => {
        return (
            <div style={{ background: '#ECECEC', padding: '30px' }} key={transaction.id}>
                <Card title={`Date: ${transaction.created_at}`} bordered={false} style={{ width: 300 }}>
                    <p>{`longitude: ${transaction.longitude}`}</p>
                    <p>{`latitude: ${transaction.latitude}`}</p>
                    <p>{`Duration: ${transaction.duration}`}</p>
                    <p>{`Paid Amount: ${transaction.price}`}</p>
                </Card>
            </div>
        )
    })}
    </div>
    )
    
}
