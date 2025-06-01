import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";
import SceneConfigure from "../components/SceneConfigure";
import Upload from "../components/Upload";
import VrCard from "../components/VrCard";
import image1 from "../Assets/Image1.jpg";
import image2 from "../Assets/Image 2.jpg";
import image3 from "../Assets/Image 3.jpg";
import image4 from "../Assets/Image 4.jpg";
import image5 from "../Assets/Image 5.jpg";
import image6 from "../Assets/Image 6.jpg";

const Home = () => {
  const images = [
    { src: image1, label: "Living Room", name: "Image1.jpg" },
    { src: image2, label: "Kitchen", name: "Image 2.jpg" },
    { src: image3, label: "Bedroom", name: "Image 3.jpg" },
    { src: image4, label: "Office", name: "Image 4.jpg" },
    { src: image5, label: "Terrace", name: "Image 5.jpg" },
    { src: image6, label: "Garden", name: "Image 6.jpg" },
    { src: image1, label: "Living Room", name: "Image1.jpg" },
    { src: image2, label: "Kitchen", name: "Image 2.jpg" },
    
  ];

  return (
    <>
      <div>
        <Navbar />
        <SceneConfigure />
        <Upload />
        {/* <VrCard /> */}
        <div className="flex flex-wrap gap-6 justify-center p-8">
          {images.map((img, index) => (
            <VrCard
              key={index}
              imageUrl={img.src}
              chipLabel={img.label}
              filename={img.name}
            />
          ))}
        </div>
        <BottomNav />
      </div>
    </>
  );
};

export default Home;
