import React from 'react'
import { observer } from "mobx-react-lite";
import { UserPolicyProps } from '../__generated__/types';
import DOMPurify from 'dompurify';

const UserPolicy = ({
    acceptanceofTerms,
    partiesResponsibilities,
    intellectualPropertyRights,
    privacyConfidentialInformation,
    userRegistrationSecurity,
    forceMajeure,
    agreementValidity,
    amendmentstoTerms,
    notifications,
    generalTermsofUse,
}: UserPolicyProps) => {

    const sanitizeHTML = (dirtyHTML: string | undefined) => {
        if (!dirtyHTML) return { __html: '' };
        return { __html: DOMPurify.sanitize(dirtyHTML) };
    };

    const renderSection = (section: { title?: string, content?: string } | null | undefined) => {
        if (!section || !section.title || !section.content) return null;

        return (
            <div key={section.title} className='flex flex-col gap-2'>
                <h1 className="text-2xl font-medium text-[color:var(--color-two)]">
                    {section.title}
                </h1>
                <div
                    className='text-lg text-[color:var(--black-two)]'
                    dangerouslySetInnerHTML={sanitizeHTML(section.content)}
                />
            </div>
        )
    }

    return (
        <div className="layout flex flex-col gap-8 my-14">
            {renderSection(acceptanceofTerms)}
            {renderSection(partiesResponsibilities)}
            {renderSection(intellectualPropertyRights)}
            {renderSection(privacyConfidentialInformation)}
            {renderSection(userRegistrationSecurity)}
            {renderSection(forceMajeure)}
            {renderSection(agreementValidity)}
            {renderSection(amendmentstoTerms)}
            {renderSection(notifications)}
            {renderSection(generalTermsofUse)}
        </div>
    )
}

export default observer(UserPolicy)