import { Fragment, useContext, useState } from "react";
import { Dialog, DialogBody } from "@material-tailwind/react";
import myContext from "../../context/data/myContext";
import {
    AiOutlineShareAlt,
    AiFillLinkedin,
    AiFillInstagram,
    AiFillGithub,
    AiFillFacebook,
    AiOutlineTwitter
} from 'react-icons/ai';
import Toast from '../toast/Toast';

export default function ShareDialogBox({ title, url }) {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const handleOpen = () => setOpen(!open);

    const context = useContext(myContext);
    const { mode } = context;

    // Get current page URL and title
    const currentUrl = url || window.location.href;
    const currentTitle = title || document.title || 'PHcoder05 Blog';

    // Social media share URLs
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(currentTitle)}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(currentTitle)}`;
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(currentTitle + ' ' + currentUrl)}`;

    const handleShare = (shareUrl, platform) => {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        setToast({
            message: `Shared on ${platform}!`,
            type: 'success',
            duration: 2000
        });
        console.log(`Shared on ${platform}`);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setToast({
                message: 'Link copied to clipboard!',
                type: 'success',
                duration: 2000
            });
            console.log('Link copied to clipboard');
        } catch (err) {
            setToast({
                message: 'Failed to copy link',
                type: 'error',
                duration: 3000
            });
            console.error('Failed to copy link:', err);
        }
    };

    const closeToast = () => {
        setToast(null);
    };

    return (
        <Fragment>
            <div className="ml-auto cursor-pointer" onClick={handleOpen}>
                <AiOutlineShareAlt 
                    style={{ color: 'white' }} 
                    size={20} 
                    className="hover:text-teal-300 transition-colors duration-200"
                />
            </div>
            
            {/* Dialog */}
            <Dialog 
                className="relative right-[1em] w-[25em] md:right-0 md:w-0 lg:right-0 lg:w-0" 
                open={open} 
                handler={handleOpen} 
                style={{ 
                    background: mode === 'dark' ? '#1e293b' : '#ffffff', 
                    color: mode === 'dark' ? 'white' : 'black' 
                }}
            >
                {/* DialogBody */}
                <DialogBody>
                    <div className="text-center mb-6">
                        <h2 className={`text-xl font-bold mb-2 ${
                            mode === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                            Share This Page
                        </h2>
                        <p className={`text-sm ${
                            mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Share this page with your friends and followers
                        </p>
                    </div>

                    <div className="flex justify-center flex-wrap sm:mx-auto sm:mb-2 -mx-2 mt-4 mb-2">
                        {/* Social Media Icons */}
                        <div className="flex gap-4 flex-wrap justify-center">
                            {/* LinkedIn */}
                            <div 
                                className="p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors duration-200 cursor-pointer"
                                onClick={() => handleShare(linkedinShareUrl, 'LinkedIn')}
                                title="Share on LinkedIn"
                            >
                                <AiFillLinkedin 
                                    size={35} 
                                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200" 
                                />
                            </div>

                            {/* Facebook */}
                            <div 
                                className="p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors duration-200 cursor-pointer"
                                onClick={() => handleShare(facebookShareUrl, 'Facebook')}
                                title="Share on Facebook"
                            >
                                <AiFillFacebook 
                                    size={35} 
                                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200" 
                                />
                            </div>

                            {/* Twitter */}
                            <div 
                                className="p-3 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors duration-200 cursor-pointer"
                                onClick={() => handleShare(twitterShareUrl, 'Twitter')}
                                title="Share on Twitter"
                            >
                                <AiOutlineTwitter 
                                    size={35} 
                                    className="text-blue-400 hover:text-blue-500 transition-colors duration-200" 
                                />
                            </div>

                            {/* WhatsApp */}
                            <div 
                                className="p-3 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors duration-200 cursor-pointer"
                                onClick={() => handleShare(whatsappShareUrl, 'WhatsApp')}
                                title="Share on WhatsApp"
                            >
                                <svg 
                                    className="w-9 h-9 text-green-600 hover:text-green-700 transition-colors duration-200" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                </svg>
                            </div>

                            {/* Copy Link */}
                            <div 
                                className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                onClick={handleCopyLink}
                                title="Copy link"
                            >
                                <svg 
                                    className="w-9 h-9 text-gray-600 hover:text-gray-700 transition-colors duration-200" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Powered By */}
                    <div className="text-center mt-6">
                        <h1 className="text-gray-600 text-sm">Powered By PHcoder05</h1>
                    </div>
                </DialogBody>
            </Dialog>

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={closeToast}
                />
            )}
        </Fragment>
    );
}
