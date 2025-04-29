import React from 'react'
import { observer } from "mobx-react-lite";
import { DistanceAgreementProps } from '../__generated__/types';

const DistanceAndAgreements = (props: DistanceAgreementProps) => {
    return (
        <div className='layout flex flex-col gap-8 my-14'>
            <h1 className="text-2xl font-medium text-[color:var(--color-two)]">
                {props.pageTitle}
            </h1>
            <div
                className='prose marker:text-[color:var(--rich-color)] rtl:prose-ul:pr-3 prose-table:!border-[color:var(--rich-color)] prose-tr:!border-[color:var(--rich-color)] prose-th:!border-[color:var(--rich-color)] prose-thead:!border-[color:var(--rich-color)] prose-td:!border-[color:var(--rich-color)] prose-p:[color:#374151] prose-headings:!text-[color:var(--rich-color)] max-w-none prose-sm'
                dangerouslySetInnerHTML={{ __html: props.pageContent ?? "" }}
            />
        </div>
    )
}

export default observer(DistanceAndAgreements)