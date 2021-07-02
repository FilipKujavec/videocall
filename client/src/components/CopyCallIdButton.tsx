import React from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface Props {
    callId: string
}

export const CopyCallIdButton = (props: Props) => {
    const { callId } = props;

    interface Event {
        target: {
            select: () => void
        }
    }

    const handleFocus = (e: Event) => {
        e.target.select();
    }

    const onClick = (e: any) => {
        e.target.select();
    }

    return (
        <div className='clipboard wrapper'>
            <CopyToClipboard text={callId}>
                <button className='clipboard button'>
                    <span className="material-icons">
                        content_copy
                    </span>
                </button>
            </CopyToClipboard>
            <input onClick={(e) => onClick(e)} onFocus={(e) => handleFocus(e)} className='clipboard input' value={callId} />
        </div>
    )
}

const mapStateToProps = (state: any) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyCallIdButton)
