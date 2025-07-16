import React, { useState, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface CommentRulesModalProps {
    trigger: (event: () => void) => React.ReactNode;
    rulesHtml: string;
    modalTitle?: string;
    commentRules?: string;
    buttonText?: string;
}

const CommentRulesModal: React.FC<CommentRulesModalProps> = ({ trigger, rulesHtml, modalTitle, commentRules, buttonText }) => {
    const [showModal, setShowModal] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, () => setShowModal(false));

    return (
        <>
            {trigger(() => setShowModal(true))}
            {showModal && (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-hidden focus:outline-hidden">
                        <div className="relative w-auto my-6 mx-auto max-w-2xl">
                            <div
                                ref={ref}
                                className="border-0 p-6 gap-3 rounded-sm shadow-lg relative flex flex-col w-full bg-[color:var(--bg-color)] outline-hidden focus:outline-hidden"
                            >
                                {Boolean(modalTitle) && (
                                    <h2 className="text-xl font-semibold mb-4 text-[color:var(--color-three)]">
                                        {modalTitle}
                                    </h2>
                                )}
                                <div
                                    className="prose marker:text-[color:var(--rich-color)] rtl:prose-ul:pr-3 prose-table:!border-[color:var(--rich-color)] prose-tr:!border-[color:var(--rich-color)] prose-th:!border-[color:var(--rich-color)] prose-thead:!border-[color:var(--rich-color)] prose-td:!border-[color:var(--rich-color)] prose-p:[color:#374151] prose-headings:!text-[color:var(--rich-color)] max-w-none prose-sm"
                                    dangerouslySetInnerHTML={{ __html: rulesHtml || "" }}
                                />
                                {Boolean(commentRules) && (
                                    <div
                                        className="prose marker:text-[color:var(--rich-color)] rtl:prose-ul:pr-3 prose-table:!border-[color:var(--rich-color)] prose-tr:!border-[color:var(--rich-color)] prose-th:!border-[color:var(--rich-color)] prose-thead:!border-[color:var(--rich-color)] prose-td:!border-[color:var(--rich-color)] prose-p:[color:#374151] prose-headings:!text-[color:var(--rich-color)] max-w-none prose-sm"
                                        dangerouslySetInnerHTML={{ __html: commentRules || "" }}
                                    />
                                )}
                                {Boolean(buttonText) && (
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="mt-6 tracking-wide hover:opacity-80 transition duration-300 w-full bg-[color:var(--color-three)] text-sm md:text-base font-medium text-white rounded-sm py-2.5 px-5 cursor-pointer"
                                    >
                                        {buttonText}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="opacity-50 fixed inset-0 z-40 bg-black" />
                </>
            )}
        </>
    );
};

export default CommentRulesModal;
