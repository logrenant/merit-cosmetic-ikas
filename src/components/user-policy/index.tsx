import React from 'react'
import { observer } from "mobx-react-lite";
import { UserPolicyProps } from '../__generated__/types';

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

    const renderSection = (section?: { title?: string; content?: string } | null) => {
        if (!section || (!section.title && !section.content)) return null;

        return (
            <div className="flex flex-col gap-2">
                {section.title && (
                    <h2 className="text-2xl font-medium text-[color:var(--color-two)]">
                        {section.title}
                    </h2>
                )}
                {section.content && (
                    <div
                        className="text-lg text-[color:var(--black-two)]"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                )}
            </div>
        );
    };

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
    );
};

export default observer(UserPolicy);
