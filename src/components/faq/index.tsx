import React from 'react'
import { observer } from "mobx-react-lite";
import { FaqProps } from '../__generated__/types';
import DOMPurify from 'dompurify';

const Faq = ({
    title,
    faqQuestion1,
    faqQuestion2,
    faqQuestion3,
    faqQuestion4,
    faqQuestion5,
    faqQuestion6,
}: FaqProps) => {

    const renderSection = (section: { title?: string, content?: string } | null | undefined) => {
        if (!section || !section.title || !section.content) return null;

        return (
            <div key={section.title} className='flex flex-col gap-2'>
                <h1 className="text-2xl font-medium text-[color:var(--color-two)]">
                    {section.title}
                </h1>
                <div
                    className='text-lg text-[color:var(--black-two)]'
                    dangerouslySetInnerHTML={{ __html: section.content }}
                />
            </div>
        )
    }

    return (
        <div className="layout flex flex-col gap-8 my-14">
            {/* <div className='text-3xl font-medium text-[color:var(--color-two)]'>{title}</div> */}
            {renderSection(faqQuestion1)}
            {renderSection(faqQuestion2)}
            {renderSection(faqQuestion3)}
            {renderSection(faqQuestion4)}
            {renderSection(faqQuestion5)}
            {renderSection(faqQuestion6)}
        </div>
    )
}

export default observer(Faq)