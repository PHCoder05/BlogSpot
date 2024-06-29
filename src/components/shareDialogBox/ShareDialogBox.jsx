import { Fragment, useContext, useState } from "react";
import { Dialog, DialogBody } from "@material-tailwind/react";
import myContext from "../../context/data/myContext";
import {
    AiOutlineShareAlt,
    AiFillLinkedin,
    AiFillInstagram,
    AiFillGithub,
    AiFillFacebook
} from 'react-icons/ai';

export default function ShareDialogBox({ title, url }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const context = useContext(myContext);
    const { mode } = context;

    // Social media share URLs
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    const instagramShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(url)}`; // Instagram doesn't support direct sharing links like others
    const githubShareUrl = `https://github.com/share?url=${encodeURIComponent(url)}`; // GitHub doesn't support direct sharing links like others
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

    return (
        <Fragment>
            <div className="ml-auto">
                <AiOutlineShareAlt onClick={handleOpen} style={{ color: mode === 'dark' ? 'white' : 'black' }} size={20} />
            </div>
            {/* Dialog  */}
            <Dialog className="relative right-[1em] w-[25em] md:right-0 md:w-0 lg:right-0 lg:w-0" open={open} handler={handleOpen} style={{ background: mode === 'light' ? '#2f3542' : '#2f3542', color: mode === 'dark' ? 'white' : 'black' }}>
                {/* DialogBody  */}
                <DialogBody>
                    <div className="flex justify-center flex-wrap sm:mx-auto sm:mb-2 -mx-2 mt-4 mb-2">
                        {/* main  */}
                        <div className="flex gap-3">
                            {/* Linkedin Icon  */}
                            <div>
                                <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer">
                                    <AiFillLinkedin size={35} style={{ color: mode === 'dark' ? 'white' : 'black' }} />
                                </a>
                            </div>

                            {/* Instagram Icon  */}
                            <div>
                                <a href={instagramShareUrl} target="_blank" rel="noopener noreferrer">
                                    <AiFillInstagram size={35} style={{ color: mode === 'dark' ? 'white' : 'black' }} />
                                </a>
                            </div>

                            {/* Github Icon  */}
                            <div>
                                <a href={githubShareUrl} target="_blank" rel="noopener noreferrer">
                                    <AiFillGithub size={35} style={{ color: mode === 'dark' ? 'white' : 'black' }} />
                                </a>
                            </div>

                            {/* Facebook Icon  */}
                            <div>
                                <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer">
                                    <AiFillFacebook size={35} style={{ color: mode === 'dark' ? 'white' : 'black' }} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <h1 className="text-gray-600">Powered By PHcoder05</h1>
                    </div>
                </DialogBody>
            </Dialog>
        </Fragment>
    );
}
