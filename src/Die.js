import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#5035FF" : "white"
    }

    const dotElements = []
    for (let i = 0; i < props.value; i ++) {
        dotElements.push(<div className="dot"></div>)
    }

    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            {dotElements}
            
        </div>
    )
}