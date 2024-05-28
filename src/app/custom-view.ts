import {
  GanttDate,
  GanttDatePoint,
  GanttView,
  GanttViewType,
  primaryDatePointTop,
  secondaryDatePointTop
} from "@worktile/gantt";
import {eachDayOfInterval, eachWeekOfInterval} from "date-fns";
import {fr} from "date-fns/locale";

export class GanttViewCustom extends GanttView {
  override showWeekBackdrop = true;
  override showTimeline = true;
  override viewType = GanttViewType.day;

  viewStartOf(date: GanttDate): GanttDate {
    return date.startOfWeek({weekStartsOn: 1});
  }

  viewEndOf(date: GanttDate): GanttDate {
    return date.endOfWeek({weekStartsOn: 1});
  }

  getPrimaryWidth(): number {
      return this.getCellWidth() * 7;
  }

  getDayOccupancyWidth(_: GanttDate): number {
    return this.cellWidth;
  }

  getPrimaryDatePoints(): GanttDatePoint[] {
    const weeks = eachWeekOfInterval({start: this.start.value, end: this.end.addSeconds(1).value});
    const points: GanttDatePoint[] = [];
    for (let i = 0; i < weeks.length; i++) {
      const weekStart = new GanttDate(weeks[i]);
      const increaseWeek = weekStart.getDaysInMonth() - weekStart.getDate() >= 3 ? 0 : 1;
      const point = new GanttDatePoint(
        weekStart,
        weekStart.addWeeks(increaseWeek).format('LLLL yyyy', {
          locale: fr,
        }),
        (this.getCellWidth() * 7) / 2 + i * (this.getCellWidth() * 7),
        primaryDatePointTop
      );

      points.push(point);
    }

    return points;
  }

  getSecondaryDatePoints(): GanttDatePoint[] {
    const days = eachDayOfInterval({start: this.start.value, end: this.end.value});
    const points: GanttDatePoint[] = [];
    for (let i = 0; i < days.length; i++) {
      const start = new GanttDate(days[i]);
      const point = new GanttDatePoint(
        start,
        start.format('d', {
          locale: fr,
        }),
        i * this.getCellWidth() + this.getCellWidth() / 2,
        secondaryDatePointTop,
        {
          isWeekend: start.isWeekend(),
          isToday: start.isToday()
        }
      );

      if (start.isToday()) {
        point.style = {fill: '#ff9f73'};
      }

      points.push(point);
    }

    return points;
  }
}
