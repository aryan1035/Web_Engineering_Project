

export default function About() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* About Us Section */}
      <div className="flex flex-col items-center py-16">

        <div className="flex flex-col items-center max-w-[1200px] w-full px-8 mb-32">
          {/* Centered About Us Heading */}
          {/* <h1 className="text-gray-600 text-3xl font-bold mb-12 text-center">About Us</h1> */}

          <div className="flex items-start w-full gap-12">
            {/* Why Choose Us Image */}
            <div className="flex flex-col shrink-0 items-start bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/v0o8XbXdnI/4oz0370x_expires_30_days.png')] bg-cover bg-center w-[400px] h-[500px] pt-[386px] pl-[42px]">
              {/* <span className="text-gray-600 text-2xl font-semibold">Why Choose Us</span> */}
            </div>

            {/* About Text */}
            <div className="flex-1 flex-col items-center text-gray-600 text-lg leading-relaxed">
              <h1 className="text-gray-600 text-3xl font-bold mb-12 text-center">About Us</h1>
              <p className="mb-6">
                Welcome to CureNet, your trusted partner in managing your healthcare needs conveniently and efficiently. At CureNet, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
              </p>
              <p className="mb-6">
                CureNet is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, CureNet is here to support you every step of the way.
              </p>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Our Vision</h2>
              <p>
                Our vision at CureNet is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="flex flex-col items-start max-w-[1200px] w-full px-8 mb-32">
          <div className="flex items-center justify-between w-full mb-8">
            <span className="text-gray-800 text-lg font-bold">Efficiency:</span>
            <span className="text-gray-800 text-lg font-bold">Convenience:</span>
            <span className="text-gray-800 text-lg font-bold">Personalization:</span>
          </div>
          <div className="flex justify-between items-start w-full gap-8">
            <span className="text-gray-600 text-lg flex-1">
              Streamlined appointment scheduling that fits into your busy lifestyle.
            </span>
            <span className="text-gray-600 text-lg flex-1">
              Access to a network of trusted healthcare professionals in your area.
            </span>
            <span className="text-gray-600 text-lg flex-1">
              Tailored recommendations and reminders to help you stay on top of your health.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
