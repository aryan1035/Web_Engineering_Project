import contactImage from '../assets/contactUs.png';

export default function Contact() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Contact Section */}
      <div className="flex flex-col items-center self-stretch pt-8 pb-16">
        <div className="flex flex-col items-start max-w-[1100px] w-full px-8 pt-0.5 mb-[30px] gap-8">
          {/* Contact Us Heading */}
          <div className="flex flex-col items-center self-stretch">
            <div className="flex flex-col items-start pb-[1px]">
              <span className="text-gray-600 text-4xl font-bold">CONTACT Us</span>
            </div>
          </div>

          {/* Contact Content */}
          <div className="flex items-start gap-12 w-full">
            {/* Contact Image */}
            <img
              src={contactImage}
              className="w-[500px] h-auto object-contain"
              alt="Contact Illustration"
            />

            {/* Contact Information */}
            <div className="flex flex-col shrink-0 items-start pb-[1px] pr-[1px] mt-8">
              <span className="text-gray-600 text-xl font-bold mb-10">Our OFFICE</span>
              <span className="text-gray-600 text-base w-[219px] mb-12 whitespace-pre-line">
                54709 Willms Station {'\n'}Suite 350,Chittagong, Bangladesh
              </span>
              <span className="text-gray-600 text-base mb-6">Tel: (415) 555‑0132</span>
              <span className="text-gray-600 text-base mb-12 ml-[1px]">
                Email: curenet@gmail.com
              </span>
              <span className="text-gray-600 text-xl font-bold mb-8">
                Careers at CureNet
              </span>
              <span className="text-gray-600 text-base mb-8 ml-[1px]">
                Learn more about our teams and job openings.
              </span>
              <div className="flex flex-col items-start py-4 px-12 border border-solid border-gray-800 hover:bg-gray-50 transition-colors cursor-pointer">
                <span className="text-gray-800 text-sm font-medium">Explore Jobs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
