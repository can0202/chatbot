import { Button, Col, Menu, message, Popover, Row } from "antd";
import avatarChatBot from "../../assets/icons/avataChatbot.svg";
import ChatSuggestive from "../ChatSuggestive";

interface ChatContentProps {
  title: string;
  streamData: any[];
  handleClickSuggest: (item: string) => void;
  setQuestion: (q: string) => void;
  handleDeleteMessage: (item: any) => void;
  setIsEditing: (q: boolean) => void;
  setQuestionEdit: (q: any) => void;
  setIsToast: (q: any) => void;
  isLoading: boolean;
}

const ChatContent = ({
  title,
  streamData,
  handleClickSuggest,
  setQuestion,
  handleDeleteMessage,
  setIsEditing,
  setQuestionEdit,
  setIsToast,
  isLoading,
}: ChatContentProps) => {
  const handleCopy = (htmlText: any) => {
    // Sử dụng DOMParser để loại bỏ thẻ HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");
    const textContent = doc.body.innerText;
    navigator.clipboard
      .writeText(textContent)
      .then(() => {
        setIsToast(true);
      })
      .catch((error) => {
        console.log(error);
        message.error("Sao chép thất bại!");
      });
  };

  const handleAction = async (key: string, item: any) => {
    switch (key) {
      case "copy":
        handleCopy(item?.text);
        break;
      case "edit":
        setQuestion(item?.text);
        setQuestionEdit(item?.preMessageId);
        setIsEditing(true);
        break;
      case "delete":
        handleDeleteMessage(item);
        break;
      default:
        break;
    }
  };
  const uniqueId = () => Date.now() + Math.random().toString(36).substr(2, 9);
  return (
    <>
      {streamData?.map((item, index) => {
        let contentMenu = (
          <div style={{ display: "flex" }}>
            <Menu
              className="popover-menu"
              onClick={(e) => {
                e.domEvent.stopPropagation();
                handleAction(e.key, item);
              }}
            >
              <Menu.Item key={"edit"}>
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
                    stroke-linecap="round"
                  />
                  <path
                    d="M11.9734 3.05252L12.5914 2.4346C13.6152 1.4108 15.2751 1.4108 16.2989 2.4346C17.3227 3.4584 17.3227 5.11832 16.2989 6.14212L15.681 6.76004M11.9734 3.05252C11.9734 3.05252 12.0507 4.3656 13.2093 5.5242C14.3679 6.6828 15.681 6.76004 15.681 6.76004M11.9734 3.05252L6.29261 8.73335C5.90784 9.11812 5.71545 9.31051 5.55 9.52264C5.35482 9.77287 5.18749 10.0436 5.05096 10.3301C4.93522 10.573 4.84918 10.8311 4.67711 11.3473L3.94794 13.5348M15.681 6.76004L10.0001 12.4409C9.61536 12.8256 9.42297 13.018 9.21084 13.1835C8.96061 13.3787 8.68986 13.546 8.40338 13.6825C8.16053 13.7983 7.90241 13.8843 7.38618 14.0564L5.19868 14.7855M5.19868 14.7855L4.66396 14.9638C4.40992 15.0485 4.12984 14.9823 3.94049 14.793C3.75113 14.6036 3.68502 14.3236 3.7697 14.0695L3.94794 13.5348M5.19868 14.7855L3.94794 13.5348"
                    stroke="#181414"
                  />
                </svg>
                <span>Chỉnh sửa</span>
              </Menu.Item>
              <Menu.Item key={"copy"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <path
                    d="M5.3999 9.16675C5.3999 6.80973 5.3999 5.63121 6.13214 4.89898C6.86437 4.16675 8.04288 4.16675 10.3999 4.16675H12.8999C15.2569 4.16675 16.4354 4.16675 17.1677 4.89898C17.8999 5.63121 17.8999 6.80973 17.8999 9.16675V13.3334C17.8999 15.6904 17.8999 16.869 17.1677 17.6012C16.4354 18.3334 15.2569 18.3334 12.8999 18.3334H10.3999C8.04288 18.3334 6.86437 18.3334 6.13214 17.6012C5.3999 16.869 5.3999 15.6904 5.3999 13.3334V9.16675Z"
                    stroke="#181414"
                  />
                  <path
                    d="M5.3999 15.8334C4.01919 15.8334 2.8999 14.7141 2.8999 13.3334V8.33341C2.8999 5.19072 2.8999 3.61937 3.87621 2.64306C4.85252 1.66675 6.42387 1.66675 9.56657 1.66675H12.8999C14.2806 1.66675 15.3999 2.78604 15.3999 4.16675"
                    stroke="#181414"
                  />
                </svg>
                <span>Sao chép</span>
              </Menu.Item>
              <Menu.Item key={"delete"}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <path
                    d="M17.4831 5H3.31641"
                    stroke="#181414"
                    stroke-linecap="round"
                  />
                  <path
                    d="M16.0945 7.08325L15.7112 12.8325C15.5637 15.0449 15.4899 16.1511 14.7691 16.8255C14.0482 17.4999 12.9396 17.4999 10.7222 17.4999H10.0778C7.86044 17.4999 6.75177 17.4999 6.03093 16.8255C5.31009 16.1511 5.23635 15.0449 5.08885 12.8325L4.70557 7.08325"
                    stroke="#181414"
                    stroke-linecap="round"
                  />
                  <path
                    d="M8.31641 9.16675L8.73307 13.3334"
                    stroke="#181414"
                    stroke-linecap="round"
                  />
                  <path
                    d="M12.4831 9.16675L12.0664 13.3334"
                    stroke="#181414"
                    stroke-linecap="round"
                  />
                  <path
                    d="M5.81641 5C5.86297 5 5.88626 5 5.90736 4.99947C6.59357 4.98208 7.19893 4.54576 7.43242 3.90027C7.4396 3.88041 7.44697 3.85832 7.46169 3.81415L7.5426 3.57143C7.61166 3.36423 7.6462 3.26063 7.692 3.17267C7.87475 2.82173 8.21286 2.57803 8.60358 2.51564C8.70151 2.5 8.81072 2.5 9.02912 2.5H11.7704C11.9888 2.5 12.098 2.5 12.1959 2.51564C12.5866 2.57803 12.9247 2.82173 13.1075 3.17267C13.1533 3.26063 13.1878 3.36423 13.2569 3.57143L13.3378 3.81415C13.3525 3.85826 13.3599 3.88042 13.3671 3.90027C13.6006 4.54576 14.2059 4.98208 14.8921 4.99947C14.9132 5 14.9365 5 14.9831 5"
                    stroke="#181414"
                  />
                </svg>
                <span>Xóa</span>
              </Menu.Item>
            </Menu>
          </div>
        );
        if (!item?.isUser) {
          return (
            <div key={`${index}${uniqueId}`}>
              <div
                className={`chat-box-reply ${
                  item?.isQuestions ? "questions" : "suggestive"
                }`}
                style={{ marginBottom: "8px" }}
              >
                <Row gutter={[0, 8]}>
                  <Col xs={24}>
                    <div className="chat-box-avatar">
                      <div className="img">
                        <img src={avatarChatBot} alt={title} />
                      </div>
                      <h4>{title} - Trợ lý ảo</h4>
                    </div>
                  </Col>

                  {item?.loading ? (
                    <Col xs={24}>
                      <div className="snippet" data-title="dot-pulse">
                        <div className="stage">
                          <div className="dot-pulse"></div>
                        </div>
                      </div>
                    </Col>
                  ) : (
                    <>
                      {item?.text && (
                        <Col xs={24}>
                          <div className="text">
                            <p
                              dangerouslySetInnerHTML={{ __html: item?.text }}
                            ></p>
                            {item?.isCopy && (
                              <Button
                                type="text"
                                className="btn-copy"
                                onClick={() => handleCopy(item?.text)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="21"
                                  height="21"
                                  viewBox="0 0 21 21"
                                  fill="none"
                                >
                                  <path
                                    d="M5.3999 9.66675C5.3999 7.30973 5.3999 6.13121 6.13214 5.39898C6.86437 4.66675 8.04288 4.66675 10.3999 4.66675H12.8999C15.2569 4.66675 16.4354 4.66675 17.1677 5.39898C17.8999 6.13121 17.8999 7.30973 17.8999 9.66675V13.8334C17.8999 16.1904 17.8999 17.369 17.1677 18.1012C16.4354 18.8334 15.2569 18.8334 12.8999 18.8334H10.3999C8.04288 18.8334 6.86437 18.8334 6.13214 18.1012C5.3999 17.369 5.3999 16.1904 5.3999 13.8334V9.66675Z"
                                    stroke="#181414"
                                  />
                                  <path
                                    d="M5.3999 16.3334C4.01919 16.3334 2.8999 15.2141 2.8999 13.8334V8.83341C2.8999 5.69072 2.8999 4.11937 3.87621 3.14306C4.85252 2.16675 6.42387 2.16675 9.56657 2.16675H12.8999C14.2806 2.16675 15.3999 3.28604 15.3999 4.66675"
                                    stroke="#181414"
                                  />
                                </svg>
                              </Button>
                            )}
                          </div>
                        </Col>
                      )}
                    </>
                  )}
                </Row>
              </div>
              {item?.isQuestions && (
                <ChatSuggestive
                  suggestive={item?.questions}
                  handleClickSuggest={handleClickSuggest}
                  isQuestions={item?.isQuestions}
                  isLoading={isLoading}
                />
              )}
              {item?.suggestive?.length > 0 && (
                <ChatSuggestive
                  suggestive={item?.suggestive}
                  handleClickSuggest={handleClickSuggest}
                  isQuestions={item?.isQuestions}
                  isLoading={isLoading}
                />
              )}
            </div>
          );
        }
        if (item?.isUser) {
          return (
            <div key={index + 1}>
              <div className="chat-box-time" style={{ marginBottom: "8px" }}>
                <span>{item?.time}</span>
              </div>
              <div
                className="chat-box-question"
                style={{ marginBottom: "8px" }}
              >
                {!isLoading && (
                  <Popover content={contentMenu} placement="bottomLeft">
                    <Button type="text" className="btn-action">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="5"
                        viewBox="0 0 17 5"
                        fill="none"
                      >
                        <path
                          d="M1.79598 4.16649C0.845104 4.16649 0.065918 3.41587 0.065918 2.49987C0.065918 1.58387 0.845104 0.833252 1.79598 0.833252C2.74685 0.833252 3.52603 1.58387 3.52603 2.49987C3.52603 3.41587 2.74685 4.16649 1.79598 4.16649ZM8.39925 4.16649C7.44838 4.16649 6.66919 3.41587 6.66919 2.49987C6.66919 1.58387 7.44838 0.833252 8.39925 0.833252C9.35012 0.833252 10.1293 1.58387 10.1293 2.49987C10.1293 3.41587 9.35012 4.16649 8.39925 4.16649ZM15.0025 4.16649C14.0517 4.16649 13.2725 3.41587 13.2725 2.49987C13.2725 1.58387 14.0517 0.833252 15.0025 0.833252C15.9534 0.833252 16.7326 1.58387 16.7326 2.49987C16.7326 3.41587 15.9534 4.16649 15.0025 4.16649Z"
                          fill="#181414"
                        />
                      </svg>
                    </Button>
                  </Popover>
                )}

                <p>{item?.text}</p>
              </div>
            </div>
          );
        }
      })}
    </>
  );
};

export default ChatContent;
