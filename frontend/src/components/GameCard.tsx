import * as React from "react";
import { BookCardProps } from "../types/GameCard"; 

const truncateDescription = (description: string, wordLimit: number) => {
  const words = description.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return description;
};

export const BookCard: React.FC<BookCardProps> = ({
  author,
  date,
  title,
  description,
  coverImage,
  iconImage,
  genres
}) => {
  return (
    <article 
      className="shadow-sm bg-[#563C2D] gap-[var(--sds-size-space-600)] pr-[var(--sds-size-space-600)] rounded-[var(--sds-size-radius-200)] max-md:pr-5"
      style={{ width: '1436px', height: '297px' }}
    >
      <div className="flex gap-5 max-md:flex-col">
        <div className="flex flex-col w-[18%] max-md:ml-0 max-md:w-full">
          <img
            loading="lazy"
            src={coverImage}
            alt={`Book cover for ${title}`}
            className="object-contain grow shrink-0 max-w-full rounded-lg aspect-[0.84] min-h-[297px] min-w-[160px] w-[249px] max-md:mt-5"
          />
        </div>
        <div className="flex flex-col ml-5 w-[82%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-wrap gap-3 items-center self-stretch my-auto w-full min-h-[277px] min-w-[160px] max-md:mt-8 max-md:max-w-full">
            <div className="flex flex-wrap gap-2 items-start self-stretch my-auto text-xl leading-snug min-w-[240px] w-[1123px] max-md:max-w-full">
              <div className="self-stretch whitespace-nowrap text-stone-100 w-[145px]">
                {author}
              </div>
              <div className="flex shrink-0 h-8 bg-zinc-300 bg-opacity-0 w-[17px]" />
              <div className="self-stretch text-stone-400 w-[190px]">
                {date}
              </div>
              <div className="flex flex-1 shrink h-8 basis-0 bg-zinc-300 bg-opacity-0 min-w-[240px] w-[715px]" />
              <img
                loading="lazy"
                src={iconImage}
                alt=""
                className="object-contain shrink-0 w-6 aspect-square"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-start self-stretch my-auto min-h-[143px] min-w-[240px] w-[1123px] max-md:max-w-full">
              <h2 className="text-3xl font-bold leading-tight text-[#B28F4C] font-cinzel">
                {title}
              </h2>
              <p className="grow shrink text-xl leading-7 text-justify font-[number:var(--sds-typography-body-font-weight-regular)] text-stone-100 tracking-[4px] w-[1039px] max-md:max-w-full">
                {truncateDescription(description || '', 35)}
              </p>
            </div>
            {/* Dito nyu
             lagay yung
              mga Genrey */}
            <div className="flex flex-1 shrink self-stretch my-auto h-8 basis-[50px] bg-zinc-300 bg-opacity-0 min-w-[240px] w-[363px]" />
            {/* button ng card */}
            <button 
              className="overflow-hidden flex-wrap gap-8 content-center self-stretch px-6 py-3 my-auto font-bold leading-none shadow-md bg-stone-900 border-stone-900 min-h-[40px] min-w-[240px] pb-[var(--sds-size-space-300)] pt-[var(--sds-size-space-300)] rounded-full text-[length:var(--sds-typography-body-size-medium)] text-stone-100 max-md:px-5 ml-[-20px]"
              aria-label={`Continue reading ${title}`}
            >
              Continue your Journey
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};