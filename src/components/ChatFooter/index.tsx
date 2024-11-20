import { Input } from "antd";

interface ChatFooterProps {
  question: string;
  setQuestion: (q: string) => void;
  handleSend: () => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isLoading: boolean;
  handleStopSend: () => void;
}

const ChatFooter = ({
  question,
  setQuestion,
  handleSend,
  isEditing,
  setIsEditing,
  isLoading,
  handleStopSend,
}: ChatFooterProps) => {
  return (
    <>
      {isEditing && (
        <div className="chat-box-eidting">
          <div className="text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
            >
              <path
                d="M3.7334 18.3333H17.0667"
                stroke="#181414"
                strokeLinecap="round"
              />
              <path
                d="M11.9734 3.05252L12.5914 2.4346C13.6152 1.4108 15.2751 1.4108 16.2989 2.4346C17.3227 3.4584 17.3227 5.11832 16.2989 6.14212L15.681 6.76004M11.9734 3.05252C11.9734 3.05252 12.0507 4.3656 13.2093 5.5242C14.3679 6.6828 15.681 6.76004 15.681 6.76004M11.9734 3.05252L6.29261 8.73335C5.90784 9.11812 5.71545 9.31051 5.55 9.52264C5.35482 9.77287 5.18749 10.0436 5.05096 10.3301C4.93522 10.573 4.84918 10.8311 4.67711 11.3473L3.94794 13.5348M15.681 6.76004L10.0001 12.4409C9.61536 12.8256 9.42297 13.018 9.21084 13.1835C8.96061 13.3787 8.68986 13.546 8.40338 13.6825C8.16053 13.7983 7.90241 13.8843 7.38618 14.0564L5.19868 14.7855M5.19868 14.7855L4.66396 14.9638C4.40992 15.0485 4.12984 14.9823 3.94049 14.793C3.75113 14.6036 3.68502 14.3236 3.7697 14.0695L3.94794 13.5348M5.19868 14.7855L3.94794 13.5348"
                stroke="#181414"
              />
            </svg>
            <span>Chỉnh sửa tin nhắn</span>
          </div>
          <div
            className="close"
            onClick={() => {
              setQuestion("");
              setIsEditing(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
            >
              <path
                d="M11.3994 1.50037L6.39941 6.50037M6.39941 6.50037L1.39941 11.5004M6.39941 6.50037L11.3994 11.5004M6.39941 6.50037L1.39941 1.50037"
                stroke="#181414"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="chat-box-footer">
        <div className="chat-box-input">
          <Input
            placeholder="Hãy trò chuyện với tôi nhé"
            value={question}
            maxLength={4000}
            onChange={(e) => setQuestion(e.target.value)}
            onPressEnter={() => {
              if (!isLoading) {
                handleSend();
              }
            }}
            // disabled={isLoading}
            suffix={
              <>
                {isLoading ? (
                  <svg
                    onClick={handleStopSend}
                    style={{ cursor: "pointer" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M1.66663 9.99996C1.66663 6.07159 1.66663 4.1074 2.88701 2.88701C4.1074 1.66663 6.07159 1.66663 9.99996 1.66663C13.9283 1.66663 15.8925 1.66663 17.1129 2.88701C18.3333 4.1074 18.3333 6.07159 18.3333 9.99996C18.3333 13.9283 18.3333 15.8925 17.1129 17.1129C15.8925 18.3333 13.9283 18.3333 9.99996 18.3333C6.07159 18.3333 4.1074 18.3333 2.88701 17.1129C1.66663 15.8925 1.66663 13.9283 1.66663 9.99996Z"
                      fill="#D1132A"
                    />
                  </svg>
                ) : (
                  <>
                    {question ? (
                      <svg
                        style={{ cursor: "pointer" }}
                        onClick={handleSend}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.99984 18.3333C14.6022 18.3333 18.3332 14.6023 18.3332 9.99996C18.3332 5.39759 14.6022 1.66663 9.99984 1.66663C5.39746 1.66663 1.6665 5.39759 1.6665 9.99996C1.6665 14.6023 5.39746 18.3333 9.99984 18.3333ZM10.3912 7.05802C10.6353 6.81394 11.031 6.81394 11.2751 7.05802L13.7751 9.55802C14.0192 9.8021 14.0192 10.1978 13.7751 10.4419L11.2751 12.9419C11.031 13.186 10.6353 13.186 10.3912 12.9419C10.1472 12.6978 10.1472 12.3021 10.3912 12.058L11.8243 10.625H6.6665C6.32133 10.625 6.0415 10.3451 6.0415 9.99996C6.0415 9.65478 6.32133 9.37496 6.6665 9.37496H11.8243L10.3912 7.9419C10.1472 7.69782 10.1472 7.3021 10.3912 7.05802Z"
                          fill="#D1132A"
                        />
                      </svg>
                    ) : (
                      <></>
                      // <svg
                      //   xmlns="http://www.w3.org/2000/svg"
                      //   width="20"
                      //   height="20"
                      //   viewBox="0 0 20 20"
                      //   fill="none"
                      // >
                      //   <path
                      //     d="M6.66669 5C6.66669 2.5218 8.15907 1.66666 10 1.66666C11.841 1.66666 13.3334 2.5218 13.3334 5V10C13.3334 12.4782 11.841 13.3333 10 13.3333C8.15907 13.3333 6.66669 12.4782 6.66669 10V5Z"
                      //     stroke="#6C6868"
                      //   />
                      //   <path
                      //     d="M15.8334 12.5C14.1667 15.8333 11.6667 15.8333 10 15.8333C8.33335 15.8333 5.83335 15.8333 4.16669 12.5"
                      //     stroke="#6C6868"
                      //     strokeLinecap="round"
                      //   />
                      //   <path
                      //     d="M10 15.8333V18.3333"
                      //     stroke="#6C6868"
                      //     strokeLinecap="round"
                      //   />
                      // </svg>
                    )}
                  </>
                )}
              </>
            }
          />
        </div>
        <div className="chat-box-hint-text">
          <p>Trợ lý ảo có thể mắc lỗi, vui lòng kiểm tra lại câu trả lời</p>
        </div>
      </div>
    </>
  );
};

export default ChatFooter;
