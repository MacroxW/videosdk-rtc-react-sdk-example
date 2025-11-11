import { CheckIcon, ChevronDownIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import { meetingTypes } from "../utils/common";
import ConferencingIcon from "../icons/ConferencingIcon";
import LiveStreamingIcon from "../icons/LiveStreamingIcon";
import { Popover, Transition } from "@headlessui/react";

import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ModeSelectionCards({
  selectType,
  meetingType,
  participantMode,
  setParticipantMode,
}) {
  const options = selectType.find((t) => t.value === meetingType)?.options || [];

  // Optional subheadings + descriptions for each mode
  const modeInfo = {
    SEND_AND_RECV: {
      sub: "Host / Co-host Mode",
      desc: "Allows publishing and receiving media streams. Ideal for hosts who broadcast audio, video, and screen share.",
    },
    RECV_ONLY: {
      sub: "Audience Mode",
      desc: "Optimized for viewers who receive live media from hosts and engage through chat, polls, or reactions.",
    },
    SIGNALLING_ONLY: {
      sub: "Signalling Only Mode",
      desc: "Used for participants who do not publish or consume media but interact via chat or other data events.",
    },
  };


  if (!options.length) return null;

  return (
    <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5">
      {options.map((mode, index) => {
        const info = modeInfo[mode] || {};
        const selected = participantMode === mode;

        return (
          <button
            key={index}
            onClick={() => setParticipantMode(mode)}
            className={`relative group border rounded-2xl p-3.5 text-left transition-all duration-200
              ${selected
                ? "border-orange-400 bg-gray-800 shadow-lg scale-[1.02]"
                : "border-gray-600 bg-gray-700 hover:bg-gray-650 hover:shadow-md"
              }`}
          >
            {/* Checkmark for selected card */}
            {selected && (
              <CheckCircleIcon className="absolute top-3 right-3 h-6 w-6 text-[#cdb6ff]" />
            )}

            <div className="flex flex-col space-y-1">
              <h3 className="text-lg font-semibold text-white">
                {mode}
                <p className="text-sm text-[#cdb6ff]">{info.sub}</p>
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed">{info.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}



export function MeetingDetailsScreen({
  onClickJoin,
  participantName,
  setParticipantName,
  participantModeRef
}) {
  const { meetingType, setMeetingType, participantMode, setParticipantMode } = useMeetingAppContext();
  const [nextButtonClicked, setNextButtonClicked] = useState(false)
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const meetingId = params.get("meetingId");
  const token = params.get("token");

  useEffect(() => {
    participantModeRef.current = participantMode
  }, [participantMode])

  const selectType = [
    {
      Icon: ConferencingIcon,
      label: "Audio & Video Call",
      value: meetingTypes.MEETING,
      options: null
    },
    {
      Icon: LiveStreamingIcon,
      label: "Interactive Live Streaming",
      value: meetingTypes.ILS,
      options: ["SEND_AND_RECV", "RECV_ONLY"]
    },
    {
      Icon: LiveStreamingIcon,
      label: "HTTP Live Streaming",
      value: meetingTypes.HLS,
      options: ["SEND_AND_RECV", "RECV_ONLY", "SIGNALLING_ONLY"]
    },
  ];


  return (
    <div
      className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}
    >
      {nextButtonClicked &&
        <>
          {/* <div className="border border-solid border-gray-400 rounded-md px-4 py-3  flex items-center justify-center">
            <p className="text-white text-base">
              {`Meeting code : ${meetingId}`}
            </p>
            <button
              className="ml-2"
              onClick={() => {
                navigator.clipboard.writeText(meetingId);
                setIsCopied(true);
                setTimeout(() => {
                  setIsCopied(false);
                }, 3000);
              }}
            >
              {isCopied ? (
                <CheckIcon className="h-5 w-5 text-green-400" />
              ) : (
                <ClipboardIcon className="h-5 w-5 text-white" />
              )}
            </button>
          </div> */}





          {/* {selectType.find(t => t.value === meetingType)?.options != null  && <Popover className="relative w-full py-3">
            {({ open }) => (
              <>
                <Popover.Button
                  onMouseEnter={() => { setIsHovered(true) }}
                  onMouseLeave={() => { setIsHovered(false) }}
                  className={`focus:outline-none  bg-gray-650 py-3 
              ${open
                      ? "text-white ring-1 ring-gray-250 bg-black"
                      : "text-customGray-250 hover:text-white"
                    }
              group inline-flex items-center rounded-md px-1 py-1 w-full text-base font-normal
              }`}
                  onClick={() => {

                  }}
                >
                  <span className="overflow-hidden whitespace-nowrap overflow-ellipsis w-full ml-6">
                    {participantMode != null ? `Mode : ${participantMode} `: "Select a mode"}
                  </span>
                 <ChevronDownIcon
                    className={`${open ? 'text-white' : 'text-customGray-250 hover:text-white'}
                ml-8 h-5 w-10 transition duration-150 ease-in-out group-hover:text-orange-300/80 mt-1`}
                    aria-hidden="true"
                  />
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute  z-10 mt-3 w-full px-4 sm:px-0 pb-2">
                    <div className="rounded-lg shadow-lg">
                      <div className="bg-gray-350 rounded-lg">
                        <div>
                          <div className="flex flex-col">
                            {selectType.find(t => t.value === meetingType)?.options?.map(
                              (item, index) => {
                                return (
                                  <div
                                    key={`${index}`}
                                    className={` my-1 pl-4 pr-2 text-white text-left flex`}
                                  >
                                    <span className="w-6 mr-2 flex items-center justify-center">
                                      {participantMode === item && (
                                        <CheckIcon className='h-5 w-5' />
                                      )}
                                    </span>
                                    <button
                                      className={`flex flex-1 w-full text-left`}
                                      value={item}
                                      onClick={() => {

                                        setParticipantMode(item)

                                      }}
                                    >
                                      {item}
                                    </button>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>} */}

          <ModeSelectionCards
            selectType={selectType}
            meetingType={meetingType}
            participantMode={participantMode}
            setParticipantMode={setParticipantMode}
          />

          <input
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-3 mt-5 bg-gray-650 rounded-md text-white w-full text-center"
          />


          {/* <p className="text-xs text-white mt-1 text-center">
            Your name will help everyone identify you in the meeting.
          </p> */}
          <button
            disabled={participantName.length < 3}
            className={`w-full ${participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
              }  text-white px-2 py-3 rounded-md mt-5`}
            onClick={(e) => {

              if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}") && token) {
                onClickJoin(meetingId);
              } else {
                if (!token) {
                  toast(`Missing authentication token. Please provide a valid token.`, {
                    position: "bottom-left",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeButton: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                } else {
                  toast(`Invalid or missing Meeting ID. Please check and try again.`, {
                    position: "bottom-left",
                    autoClose: 4000,
                    hideProgressBar: true,
                    closeButton: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }
              }

            }}
          >
            {"Join meeting"}
          </button>
        </>}
      {/* {iscreateMeetingClicked ? (
        <div className="border border-solid border-gray-400 rounded-md px-4 py-3  flex items-center justify-center">
          <p className="text-white text-base">
            {`Meeting code : ${meetingId}`}
          </p>
          <button
            className="ml-2"
            onClick={() => {
              navigator.clipboard.writeText(meetingId);
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ClipboardIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      ) : isJoinMeetingClicked ? (
        <>
          <input
            defaultValue={meetingId}
            onChange={(e) => {
              setMeetingId(e.target.value);
            }}
            placeholder={"Enter meeting Id"}
            className="px-4 py-3 bg-gray-650 rounded-md text-white w-full text-center"
          />
          {meetingIdError && (
            <p className="text-xs text-red-600">{`Please enter valid meetingId`}</p>
          )}
        </>
      ) : null} 

      {(iscreateMeetingClicked || isJoinMeetingClicked) && (
        <>
          <input
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-3 mt-5 bg-gray-650 rounded-md text-white w-full text-center"
          />

          {/* <p className="text-xs text-white mt-1 text-center">
            Your name will help everyone identify you in the meeting.
          </p> */}
      {/* <button
            disabled={participantName.length < 3}
            className={`w-full ${participantName.length < 3 ? "bg-gray-650" : "bg-purple-350"
              }  text-white px-2 py-3 rounded-md mt-5`}
            onClick={(e) => {
              if (iscreateMeetingClicked) {
                onClickStartMeeting();
              } else {
                if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                  onClickJoin(meetingId);
                } else setMeetingIdError(true);
              }
            }}
          >
            {iscreateMeetingClicked ? "Start a meeting" : "Join a meeting"}
          </button>
        </>
      )} */}

      {/* {!iscreateMeetingClicked && !isJoinMeetingClicked && (
        <div className="w-full md:mt-0 mt-4 flex flex-col">
          <div className="flex items-center justify-center flex-col w-full ">
            <button
              className="w-full bg-purple-350 text-white px-2 py-3 rounded-md"
              onClick={async (e) => {
                const { meetingId, err } = await _handleOnCreateMeeting();
              
                if (meetingId) {
                  setMeetingId(meetingId);
                  setIscreateMeetingClicked(true);
                } else {
                  toast(
                    `${err}`,
                    {
                      position: "bottom-left",
                      autoClose: 4000,
                      hideProgressBar: true,
                      closeButton: false,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    }
                  );
                }
              }}
            >
              Create a meeting
            </button>
            <button
              className="w-full bg-gray-650 text-white px-2 py-3 rounded-md mt-5"
              onClick={(e) => {
                setIsJoinMeetingClicked(true);
              }}
            >
              Join a meeting
            </button>
          </div>
        </div>
      )} */}

      {!nextButtonClicked && (
        <div className="w-full md:mt-0 mt-4 flex flex-col">
          <p className="text-white text-lg xl:text-2xl text-center font-extrabold">
            Select meeting type
          </p>
          <div className="flex flex-col justify-between w-full mt-8">
            {selectType.map(({ Icon, label, value }, index) => (
              <button
                onClick={(e) => {
                  setMeetingType(value);
                }}
                className={`bg-gray-650 py-5  flex flex-col items-center justify-center mb-5 rounded-md ${meetingType === value
                  ? "border border-white"
                  : "border border-gray-650"
                  }`}
              >
                <Icon />
                <div className="mt-4">
                  <p
                    className={`text-base font-medium ${meetingType === value
                      ? "text-white"
                      : "text-customGray-750"
                      }`}
                  >
                    {label}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 flex w-full">
            <button
              className="rounded-md w-full py-4 bg-purple-350 text-center text-white text-xl font-bold"
              onClick={async (e) => {
                setNextButtonClicked(true)
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
