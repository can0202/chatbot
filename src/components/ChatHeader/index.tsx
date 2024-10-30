import { Button, Col, Menu, Popover, Row } from "antd";
import avatarChatBot from "../../assets/icons/avataChatbot.svg";
import gopYImg from "../../assets/icons/gop_y.svg";
import supportImg from "../../assets/icons/ho_tro.svg";
import contactImg from "../../assets/icons/lien_he.svg";

interface ChatHeaderProps {
  title: string;
  onReset: () => void;
}

const ChatHeader = ({ title, onReset }: ChatHeaderProps) => {
  let contentMenu = (
    <div style={{ display: "flex" }}>
      <Menu
        className="popover-menu"
        onClick={(e) => {
          e.domEvent.stopPropagation();
        }}
      >
        <Menu.Item key={"edit"}>
          <img src={gopYImg} alt="" />
          <a
            href={process.env.REACT_APP_CMS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Góp ý phản ánh
          </a>
        </Menu.Item>
        <Menu.Item key={"copy"}>
          <img src={supportImg} alt="" />
          <a
            href={process.env.REACT_APP_CMS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Yêu cầu hỗ trợ
          </a>
        </Menu.Item>
        <Menu.Item key={"delete"}>
          <img src={contactImg} alt="" />
          <a
            href={process.env.REACT_APP_CMS_URL}
            target="_blank"
            rel="noreferrer"
          >
            Liên hệ hợp tác
          </a>
        </Menu.Item>
      </Menu>
    </div>
  );
  return (
    <div className="chat-box-header">
      <Row
        className="chat-box-header-row"
        justify="space-between"
        align="middle"
        gutter={[16, 0]}
      >
        <Col flex={"none"}>
          <div className="chat-box-avatar">
            <img src={avatarChatBot} alt={title} />
            <h4>{title} - Trợ lý ảo</h4>
          </div>
        </Col>
        <Col>
          <div className="chat-box-resetOption">
            <Button
              type="text"
              className="btn-chatbot btn-reset"
              onClick={onReset}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M3.06653 9.44444H2.56653H3.06653ZM3.06653 10.8333L2.71437 11.1883C2.90931 11.3817 3.22375 11.3817 3.41869 11.1883L3.06653 10.8333ZM4.81853 9.79938C5.01456 9.60489 5.01581 9.28831 4.82131 9.09228C4.62682 8.89626 4.31024 8.89501 4.11421 9.08951L4.81853 9.79938ZM2.01885 9.08951C1.82282 8.89501 1.50624 8.89626 1.31175 9.09228C1.11725 9.28831 1.1185 9.60489 1.31453 9.79938L2.01885 9.08951ZM15.6195 6.09519C15.7641 6.33044 16.072 6.4039 16.3073 6.25928C16.5425 6.11466 16.616 5.80672 16.4714 5.57147L15.6195 6.09519ZM10.0657 2C5.92775 2 2.56653 5.32929 2.56653 9.44444H3.56653C3.56653 5.88897 6.47262 3 10.0657 3V2ZM2.56653 9.44444L2.56653 10.8333H3.56653L3.56653 9.44444L2.56653 9.44444ZM3.41869 11.1883L4.81853 9.79938L4.11421 9.08951L2.71437 10.4784L3.41869 11.1883ZM3.41869 10.4784L2.01885 9.08951L1.31453 9.79938L2.71437 11.1883L3.41869 10.4784ZM16.4714 5.57147C15.1547 3.42974 12.7779 2 10.0657 2V3C12.4186 3 14.4785 4.23919 15.6195 6.09519L16.4714 5.57147Z"
                  fill="#181414"
                />
                <path
                  d="M16.9282 9.16669L17.2797 8.81108C17.0849 8.61856 16.7715 8.61856 16.5767 8.81108L16.9282 9.16669ZM15.1715 10.2C14.9752 10.3941 14.9733 10.7107 15.1674 10.9071C15.3615 11.1035 15.6781 11.1053 15.8745 10.9112L15.1715 10.2ZM17.9819 10.9112C18.1783 11.1053 18.4949 11.1035 18.689 10.9071C18.8832 10.7107 18.8813 10.3941 18.6849 10.2L17.9819 10.9112ZM4.32522 13.9041C4.1802 13.6691 3.87213 13.5962 3.63713 13.7412C3.40214 13.8862 3.3292 14.1943 3.47422 14.4293L4.32522 13.9041ZM9.90226 18C14.0532 18 17.4282 14.6725 17.4282 10.5556H16.4282C16.4282 14.1093 13.512 17 9.90226 17V18ZM17.4282 10.5556V9.16669H16.4282V10.5556H17.4282ZM16.5767 8.81108L15.1715 10.2L15.8745 10.9112L17.2797 9.5223L16.5767 8.81108ZM16.5767 9.5223L17.9819 10.9112L18.6849 10.2L17.2797 8.81108L16.5767 9.5223ZM3.47422 14.4293C4.796 16.5711 7.18136 18 9.90226 18V17C7.53882 17 5.47053 15.76 4.32522 13.9041L3.47422 14.4293Z"
                  fill="#181414"
                />
              </svg>
            </Button>
            <Popover content={contentMenu} placement="bottomLeft">
              <Button type="text" className="btn-chatbot btn-option">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="4"
                  viewBox="0 0 18 4"
                  fill="none"
                >
                  <path
                    d="M2.39674 3.66655C1.44587 3.66655 0.666687 2.91593 0.666687 1.99993C0.666687 1.08393 1.44587 0.333313 2.39674 0.333313C3.34762 0.333313 4.1268 1.08393 4.1268 1.99993C4.1268 2.91593 3.34762 3.66655 2.39674 3.66655ZM9.00002 3.66655C8.04915 3.66655 7.26996 2.91593 7.26996 1.99993C7.26996 1.08393 8.04915 0.333313 9.00002 0.333313C9.95089 0.333313 10.7301 1.08393 10.7301 1.99993C10.7301 2.91593 9.95089 3.66655 9.00002 3.66655ZM15.6033 3.66655C14.6524 3.66655 13.8732 2.91593 13.8732 1.99993C13.8732 1.08393 14.6524 0.333313 15.6033 0.333313C16.5542 0.333313 17.3334 1.08393 17.3334 1.99993C17.3334 2.91593 16.5542 3.66655 15.6033 3.66655Z"
                    fill="#181414"
                  />
                </svg>
              </Button>
            </Popover>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ChatHeader;
