import { Typography } from "@material-tailwind/react";

const InfoBoxCard = (props) => {
    const { title, content } = props;

    return (
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-navy-800 dark:border-navy-700">
            <Typography variant="h5" className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{title}</Typography>
            <Typography variant="small" className="mb-3 font-normal text-gray-700 dark:text-gray-400">{content}</Typography>
        </div>
    );
}

export default InfoBoxCard;