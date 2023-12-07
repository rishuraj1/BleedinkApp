import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const timeParser = (time) => {
  return dayjs(time).fromNow();
};

export default timeParser;
