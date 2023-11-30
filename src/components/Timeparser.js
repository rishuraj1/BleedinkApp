import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const timeParser = (time) => {
  const newTime = dayjs(time).fromNow();
  return newTime;
};

export default timeParser;