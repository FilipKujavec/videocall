import React, { useState } from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface Props {
    callId: string
}

export const CopyCallIdButton = (props: Props) => {
    const { callId } = props;
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    interface Event {
        target: {
            select: () => void;
        }
    }

    // const handleFocus = (e: Event) => {
    //     e.target.select();
    // }

    const onClickInput = (e: any) => {
        e.target.select();
    }

    const onClickButton = () => {
        setIsButtonClicked(true)
        
        setTimeout(() => {
            setIsButtonClicked(false)
        }, 1000)
    }

    const buttonClass = isButtonClicked ? 'buttonIsClicked':'';

    const renderCopyPopUp = () => {
        if (!isButtonClicked) return 

        return(
            // <div className='popup wrapper'>
            <div className='clipboard popup'>
                <div className='popup-wrapper'>
                    <p>Id Copied to Clipboard!</p>
                </div>
            </div>
        )
    }

    return (
        <div className='clipboard wrapper'>
            <CopyToClipboard text={callId}>
                <button onClick={() => onClickButton()} className={`clipboard button`}>
                    <span className="material-icons">
                        content_copy
                    </span>
                    {renderCopyPopUp()}
                </button>
            </CopyToClipboard>
            <input onClick={(e) => onClickInput(e)} className='clipboard input' value={callId} />
        </div>
    )
}

const mapStateToProps = (state: any) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyCallIdButton)
