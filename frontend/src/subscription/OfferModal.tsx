import * as React from "react";
import { useCallback, useEffect } from "react";

interface Plan {
  duration: string;
  credit: string;
  cost: string;
}

interface OfferPlanOptionProps extends Plan {}

interface OfferSidebarProps {
  offerType: string;
  subcontext: string;
  features: string[];
}

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerType: string;
  subcontext: string;
  features: string[];
  plans: Plan[];
  onPlanSelect?: (plan: Plan) => void;
}

const OfferPlanOption: React.FC<OfferPlanOptionProps> = ({
  duration,
  credit,
  cost,
}) => {
  return (
    <article className="flex justify-between items-center p-5 text-white rounded-lg bg-zinc-300 bg-opacity-10 max-sm:flex-col max-sm:gap-2.5 max-sm:items-start">
      <div>
        <h3 className="mb-0.5 text-sm font-bold">{duration}</h3>
        <p className="text-xs">{credit}</p>
      </div>
      <p className="text-sm font-bold max-sm:self-end">{cost}</p>
    </article>
  );
};

const OfferSidebar: React.FC<OfferSidebarProps> = ({
  offerType,
  subcontext,
  features,
}) => {
  return (
    <aside className="px-6 py-3 text-white bg-[#311F17] w-[220px] max-md:p-5 max-md:w-full">
      <h2 className="pt-2.5 mb-2 text-4xl font-cinzel">{offerType}</h2>
      <p className="mb-8 text-sm">{subcontext}</p>
      <section className="text-sm">
        <h3 className="mb-2 text-base">List of features</h3>
        <ul>
          {features.map((feature, index) => (
            <li key={index} className="mb-1.5">
              {feature}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};

export const OfferModal: React.FC<OfferModalProps> = ({
  isOpen,
  onClose,
  offerType,
  subcontext,
  features,
  plans,
  onPlanSelect,
}) => {
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex justify-center items-center p-5 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <div
          className="flex overflow-hidden rounded-2xl h-[435px] w-[710px] max-md:flex-col max-md:h-auto max-md:w-[90%] max-sm:w-full bg-[#311F17]"
          onClick={(e) => e.stopPropagation()}
        >
          <OfferSidebar
            offerType={offerType}
            subcontext={subcontext}
            features={features}
          />

          <main className="flex-1 px-6 py-5 bg-[#563C2D] max-md:p-5">
            <h1 id="modal-title" className="mb-10 text-xl text-white">
              Choose a {offerType} Plan
            </h1>
            <div className="flex flex-col gap-2">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  onClick={() => onPlanSelect?.(plan)}
                  className="cursor-pointer"
                >
                  <OfferPlanOption
                    duration={plan.duration}
                    credit={plan.credit}
                    cost={plan.cost}
                  />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default OfferModal;
