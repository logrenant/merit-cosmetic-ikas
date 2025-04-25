import React from 'react'
import { observer } from "mobx-react-lite";
import { TermsconditionsProps } from '../__generated__/types';

const TermsAndConditions = (props: TermsconditionsProps) => {
    return (
        <div className='layout flex flex-col gap-8 my-14'>
            <h1 className="text-2xl font-medium text-[color:var(--color-two)]">
                {props.pageTitle}
            </h1>
            <div
                className='text-lg text-[color:var(--black-two)]'
                dangerouslySetInnerHTML={{ __html: props.pageContent ?? "" }}
            />
        </div>
    )
}

export default observer(TermsAndConditions)