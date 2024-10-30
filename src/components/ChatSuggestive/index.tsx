import { Button } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

interface ChatSuggestiveProps {
  suggestive: string[];
  handleClickSuggest: (item: string) => void;
  isQuestions?: boolean;
}

const ChatSuggestive = ({
  suggestive,
  handleClickSuggest,
  isQuestions = true,
}: ChatSuggestiveProps) => {
  return (
    <div
      className={`chat-box-suggestive-questions ${
        isQuestions ? "questions" : "suggestive"
      }`}
      style={{ marginBottom: "8px" }}
    >
      {suggestive?.length > 0 && (
        <>
          <h5>{isQuestions ? "Vấn đề đang gặp phải" : "Gợi ý"}</h5>
          {isQuestions ? (
            <ul>
              {suggestive?.map((item, index) => (
                <li key={index}>
                  <Button type="text" onClick={() => handleClickSuggest(item)}>
                    {item}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.5 4.16675L12.5 10.0001L7.5 15.8334"
                        stroke="#181414"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <Swiper
              navigation={true}
              modules={[Navigation]}
              className="mySwiper"
              centeredSlides={true}
              slidesPerView={1.3}
              spaceBetween={10}
              loop={true}
              // slidesPerView={"auto"}
            >
              {suggestive?.map((item, index) => (
                <SwiperSlide key={index}>
                  <Button type="text" onClick={() => handleClickSuggest(item)}>
                    {item}
                  </Button>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </>
      )}
    </div>
  );
};

export default ChatSuggestive;
