// "Details for your design": the extra questions some designs need (DESIGN_EXTRAS in
// SiteIntake.jsx). Each block only shows when the chosen design asks for it. Everything here is
// the owner's own facts; the site uses them exactly as written.
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, Field, Text, Area, inputClass } from './ui';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const timeClass = inputClass.replace('px-4', 'px-2');

function Add({ onClick, children }) {
  return (
    <button type="button" className="inline-flex items-center gap-2 font-bold text-blue-700" onClick={onClick}>
      <Plus className="w-5 h-5" /> {children}
    </button>
  );
}
function Remove({ onClick, label }) {
  return (
    <button type="button" aria-label={label} className="p-3 text-slate-500 hover:text-red-700" onClick={onClick}>
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
const Req = ({ need }) => (need === 'required' ? <span className="text-red-700"> *</span> : null);

export default function DesignExtras({ need, x, set, stepHint }) {
  const rows = (key) => x[key];
  const drop = (key, i) => set(`extras.${key}`, rows(key).filter((_, j) => j !== i));

  return (
    <Card title="Details for your design" intro="Your design shows these on the page, so we use them exactly as you write them. Fields marked * are needed for this design.">
      {need.classes && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900">Class timetable<Req need={need.classes} /></h3>
          <p className="text-sm text-slate-600">Every class in a normal week. Add a row for each class and day.</p>
          {x.classes.map((c, i) => (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-[6rem_7rem_2fr_6rem_1fr_auto] gap-2 items-center border-b border-slate-100 pb-3">
              <select aria-label="Day" className={inputClass} value={c.day} onChange={(e) => set(`extras.classes.${i}.day`, e.target.value)}>
                {DAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <input aria-label="Start time" type="time" className={timeClass} value={c.time} onChange={(e) => set(`extras.classes.${i}.time`, e.target.value)} />
              <Text aria-label="Class name" placeholder="Class name" value={c.name} onChange={(v) => set(`extras.classes.${i}.name`, v)} />
              <Text aria-label="Minutes" placeholder="Minutes" inputMode="numeric" value={c.minutes} onChange={(v) => set(`extras.classes.${i}.minutes`, v.replace(/\D/g, ''))} />
              <Text aria-label="Coach (optional)" placeholder="Coach (optional)" value={c.coach} onChange={(v) => set(`extras.classes.${i}.coach`, v)} />
              <Remove label="Remove class" onClick={() => drop('classes', i)} />
            </div>
          ))}
          <Add onClick={() => set('extras.classes', [...x.classes, { day: x.classes.at(-1)?.day ?? 'Mon', time: x.classes.at(-1)?.time ?? '18:00', name: '', minutes: '45', coach: '' }])}>Add a class</Add>
        </div>
      )}

      {need.line && (
        <Field label="A short line for the top of your page" htmlFor="x-line" hint="Optional, up to 80 characters. For example: Your story. Your scars. Your legacy.">
          <Text id="x-line" value={x.line} onChange={(v) => set('extras.line', v)} maxLength={80} />
        </Field>
      )}

      {need.steps && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900">Step by step<Req need={need.steps} /></h3>
          <p className="text-sm text-slate-600">{stepHint} Three to six steps, in order, in your own words.</p>
          {x.steps.map((st, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
              <div className={`grid gap-2 items-center ${need.stepTimes ? 'grid-cols-[7rem_1fr_auto]' : 'grid-cols-[1fr_auto]'}`}>
                {need.stepTimes && <input aria-label="Usual time (optional)" type="time" className={timeClass} value={st.time} onChange={(e) => set(`extras.steps.${i}.time`, e.target.value)} />}
                <Text aria-label={`Step ${i + 1} name`} placeholder={`Step ${i + 1} name`} value={st.title} onChange={(v) => set(`extras.steps.${i}.title`, v)} maxLength={40} />
                <Remove label="Remove step" onClick={() => drop('steps', i)} />
              </div>
              <Area aria-label={`What happens in step ${i + 1}`} rows={2} placeholder="What happens in this step" value={st.text} onChange={(v) => set(`extras.steps.${i}.text`, v)} maxLength={260} />
            </div>
          ))}
          {x.steps.length < 6 && <Add onClick={() => set('extras.steps', [...x.steps, { title: '', text: '', time: '' }])}>Add a step</Add>}
        </div>
      )}

      {need.packages && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900">Packages or plans<Req need={need.packages} /></h3>
          <p className="text-sm text-slate-600">Bundles you sell, with what is included. Skip this if you only sell single services.</p>
          {x.packages.map((k, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
              <div className="grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-2 items-center">
                <Text aria-label="Package name" placeholder="Package name" value={k.name} onChange={(v) => set(`extras.packages.${i}.name`, v)} />
                <Text aria-label="Price" placeholder="Price" value={k.price} onChange={(v) => set(`extras.packages.${i}.price`, v)} />
                <Text aria-label="Length (optional)" placeholder="Length (optional)" value={k.length} onChange={(v) => set(`extras.packages.${i}.length`, v)} />
                <Remove label="Remove package" onClick={() => drop('packages', i)} />
              </div>
              <Text aria-label="What is included (optional)" placeholder="What is included, separated by commas (optional)" value={k.includes} onChange={(v) => set(`extras.packages.${i}.includes`, v)} />
            </div>
          ))}
          {x.packages.length < 8 && <Add onClick={() => set('extras.packages', [...x.packages, { name: '', price: '', length: '', includes: '' }])}>Add a package</Add>}
        </div>
      )}

      {need.makes && (
        <Field label={<>Makes you work on<Req need={need.makes} /></>} htmlFor="x-makes" hint="Separate with commas, for example: Ford, Toyota, Honda. Words only; we never use brand logos.">
          <Area id="x-makes" rows={2} value={x.makes} onChange={(v) => set('extras.makes', v)} maxLength={600} />
        </Field>
      )}

      {need.interval && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900">Your interval<Req need={need.interval} /></h3>
          <p className="text-sm text-slate-600">Visitors can try a few rounds on a timer on your site. Use the times your classes use.</p>
          <div className="grid sm:grid-cols-4 gap-3">
            <Field label="What you call it" htmlFor="x-int-name"><Text id="x-int-name" placeholder="Thirty on, thirty off" value={x.interval.name} onChange={(v) => set('extras.interval.name', v)} maxLength={40} /></Field>
            <Field label="Work (seconds)" htmlFor="x-int-work"><Text id="x-int-work" inputMode="numeric" value={x.interval.work} onChange={(v) => set('extras.interval.work', v.replace(/\D/g, ''))} /></Field>
            <Field label="Rest (seconds)" htmlFor="x-int-rest"><Text id="x-int-rest" inputMode="numeric" value={x.interval.rest} onChange={(v) => set('extras.interval.rest', v.replace(/\D/g, ''))} /></Field>
            <Field label="Rounds to try" htmlFor="x-int-rounds"><Text id="x-int-rounds" inputMode="numeric" value={x.interval.rounds} onChange={(v) => set('extras.interval.rounds', v.replace(/\D/g, ''))} /></Field>
          </div>
          <Field label="A line under the timer (optional)" htmlFor="x-int-note"><Text id="x-int-note" placeholder="Our classes run 16 rounds. Try 4 here." value={x.interval.note} onChange={(v) => set('extras.interval.note', v)} maxLength={160} /></Field>
        </div>
      )}

      {need.blocks && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900">Your programme<Req need={need.blocks} /></h3>
          <p className="text-sm text-slate-600">The blocks your programme runs in, in order. Say what each block works on; no promised results.</p>
          <Field label="Programme name" htmlFor="x-prog"><Text id="x-prog" placeholder="The 16-week plan" value={x.blocks.name} onChange={(v) => set('extras.blocks.name', v)} maxLength={50} /></Field>
          {x.blocks.list.map((bl, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3 space-y-2">
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-center">
                <Text aria-label="Block name" placeholder="Block name" value={bl.name} onChange={(v) => set(`extras.blocks.list.${i}.name`, v)} maxLength={30} />
                <Text aria-label="Weeks" placeholder="Weeks" inputMode="numeric" value={bl.weeks} onChange={(v) => set(`extras.blocks.list.${i}.weeks`, v.replace(/\D/g, ''))} />
                <Text aria-label="Sessions a week" placeholder="Sessions a week" inputMode="numeric" value={bl.sessions} onChange={(v) => set(`extras.blocks.list.${i}.sessions`, v.replace(/\D/g, ''))} />
                <Remove label="Remove block" onClick={() => set('extras.blocks.list', x.blocks.list.filter((_, j) => j !== i))} />
              </div>
              <Text aria-label="What this block works on" placeholder="What this block works on" value={bl.focus} onChange={(v) => set(`extras.blocks.list.${i}.focus`, v)} maxLength={200} />
            </div>
          ))}
          {x.blocks.list.length < 5 && <Add onClick={() => set('extras.blocks.list', [...x.blocks.list, { name: '', weeks: '4', sessions: '3', focus: '' }])}>Add a block</Add>}
        </div>
      )}

      {need.route && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900">Your route<Req need={need.route} /></h3>
          <p className="text-sm text-slate-600">Where you meet and the stops along the way, start to finish. We draw it as a sketch, not a map.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Route name" htmlFor="x-route"><Text id="x-route" placeholder="The canal loop" value={x.route.name} onChange={(v) => set('extras.route.name', v)} maxLength={50} /></Field>
            <Field label="Distance" htmlFor="x-dist"><Text id="x-dist" placeholder="6 km" value={x.route.distance} onChange={(v) => set('extras.route.distance', v)} maxLength={30} /></Field>
          </div>
          <Field label="Where to meet" htmlFor="x-meet"><Text id="x-meet" placeholder="Front steps of the library, 10 minutes before the start." value={x.route.meet} onChange={(v) => set('extras.route.meet', v)} maxLength={160} /></Field>
          {x.route.stops.map((st, i) => (
            <div key={i} className="grid sm:grid-cols-[2fr_3fr_1fr_auto] gap-2 items-center border-b border-slate-100 pb-3">
              <Text aria-label="Stop name" placeholder={i === 0 ? 'Start' : 'Stop name'} value={st.name} onChange={(v) => set(`extras.route.stops.${i}.name`, v)} maxLength={50} />
              <Text aria-label="What happens there" placeholder="What happens there" value={st.note} onChange={(v) => set(`extras.route.stops.${i}.note`, v)} maxLength={140} />
              <Text aria-label="Distance (optional)" placeholder="km (optional)" value={st.distance} onChange={(v) => set(`extras.route.stops.${i}.distance`, v)} maxLength={20} />
              <Remove label="Remove stop" onClick={() => set('extras.route.stops', x.route.stops.filter((_, j) => j !== i))} />
            </div>
          ))}
          {x.route.stops.length < 7 && <Add onClick={() => set('extras.route.stops', [...x.route.stops, { name: '', note: '', distance: '' }])}>Add a stop</Add>}
        </div>
      )}

      {need.colours && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900">Your colours<Req need={need.colours} /></h3>
          <p className="text-sm text-slate-600">The colour families you offer. Then, under Photos, pick the colour for each work photo; the colour wheel on your site shows those photos.</p>
          {x.colours.map((c, i) => (
            <div key={i} className="grid grid-cols-[3.5rem_1fr_auto] gap-2 items-center">
              <input aria-label={`Colour for ${c.name || 'this row'}`} type="color" className="h-12 w-14 rounded-lg border border-slate-300" value={c.hex} onChange={(e) => set(`extras.colours.${i}.hex`, e.target.value.toUpperCase())} />
              <Text aria-label="Colour name" placeholder="Colour name, for example Red" value={c.name} onChange={(v) => set(`extras.colours.${i}.name`, v)} maxLength={24} />
              <Remove label="Remove colour" onClick={() => drop('colours', i)} />
            </div>
          ))}
          {x.colours.length < 8 && <Add onClick={() => set('extras.colours', [...x.colours, { name: '', hex: '#C8102E' }])}>Add a colour</Add>}
        </div>
      )}
    </Card>
  );
}
