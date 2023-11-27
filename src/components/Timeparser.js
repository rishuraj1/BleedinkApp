import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const timeParser = (time) => {
  dayjs.extend(relativeTime);
  return dayjs().to(dayjs(time));
};

export default timeParser;