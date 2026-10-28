import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const teamSource = fs.readFileSync(path.join(root, "src/data/team.ts"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "ASSET_MANIFEST.json"), "utf8"));
const approved = JSON.parse(fs.readFileSync(path.join(root, "step-9b-inputs/TEAM_9B_APPROVED_DATA.json"), "utf8")) as {
  slug: string;
  name: string;
  experience: string;
  expertise: string[];
}[];

const roles = [
  "Founder & CEO",
  "Co-Founder & CTO",
  "CFO",
  "Project Manager",
  "Senior Full-Stack Developer",
  "AI Engineer",
  "Mobile App Developer",
  "UI/UX & Product Designer",
  "QA & DevOps Engineer",
];

function hash(relative: string) {
  return createHash("sha256").update(fs.readFileSync(path.join(root, relative))).digest("hex");
}

test("nine named profiles stay in role order with unique portraits", () => {
  assert.deepEqual(approved.map((person) => person.slug), [
    "founder-ceo",
    "cofounder-cto",
    "cfo",
    "project-manager",
    "senior-fullstack-developer",
    "ai-engineer",
    "mobile-app-developer",
    "uiux-product-designer",
    "qa-devops-engineer",
  ]);
  assert.equal(new Set(approved.map((person) => person.name)).size, 9);
  assert.equal((teamSource.match(/isPublished: true/g) ?? []).length, 9);
  assert.equal((teamSource.match(/isPublished: false/g) ?? []).length, 0);
  assert.equal((teamSource.match(/name: null/g) ?? []).length, 0);
  assert.equal((teamSource.match(/projectIds: \[\]/g) ?? []).length, 9);
  assert.match(teamSource, /Portrait of \$\{name\}, \$\{role\} at Vortex Digital/);

  approved.forEach((person, index) => {
    const blockStart = teamSource.indexOf(`slug: "${person.slug}",\n    name: "${person.name}"`);
    const nextMember = teamSource.indexOf("\n  {", blockStart);
    const block = teamSource.slice(blockStart, nextMember === -1 ? teamSource.indexOf("\n];", blockStart) : nextMember);
    assert.ok(blockStart > -1, person.slug);
    assert.ok(block.includes(`name: "${person.name}"`), person.slug);
    assert.ok(block.includes(`role: "${roles[index]}"`), person.slug);
    assert.ok(block.includes(`experience: "${person.experience}"`), person.slug);
    assert.ok(block.includes("isPublished: true"), person.slug);
    for (const skill of person.expertise) {
      assert.ok(block.includes(`title: "${skill}"`), `${person.slug} ${skill}`);
    }
    assert.ok(block.includes(`portrait("${person.slug}", "${person.name}", "${roles[index]}")`), person.slug);
    const portrait = `/assets/team/${person.slug}/portrait.webp`;
    const thumb = `/assets/team/${person.slug}/portrait-thumb.webp`;
    assert.equal(fs.existsSync(path.join(root, "public", portrait)), true);
    assert.equal(fs.existsSync(path.join(root, "public", thumb)), true);
    const manifestMember = manifest.members.find((member: { slug: string }) => member.slug === person.slug);
    assert.equal(manifestMember.portrait.identityVerified, true);
    assert.equal(manifestMember.portrait.path, portrait);
    assert.ok(manifestMember.workImages.every((image: { identityVerified: boolean }) => image.identityVerified === false));
  });
  assert.equal(manifest.approvedForFactualEmployeeClaims, false);
});

test("Adrian and Matheus use different portrait files, and Don's portrait is the preserved original", () => {
  assert.notEqual(
    hash("public/assets/team/uiux-product-designer/portrait.webp"),
    hash("public/assets/team/mobile-app-developer/portrait.webp"),
  );
  assert.equal(hash("step-9b-inputs/portraits/uiux-product-designer/portrait-original.png"), "43c6138bbe49f774bc615e1d9156d9eaacdef694c415e1c87a4432e8f6690864");
  assert.equal(hash("step-9b-inputs/portraits/mobile-app-developer/portrait-original.png"), "1150a588de7c5079494d06cb54078d07f4b3448ba1b6b05a3a2eac962c77cdd6");
  assert.equal(hash("public/assets/team/founder-ceo/portrait.webp"), "f3fdb05108d137608dd7370d43a3653579d1717895ac566ae1fd196930e0a204");
  assert.equal(hash("public/assets/team/founder-ceo/portrait-thumb.webp"), "21892233486f2788140b10d7547084b9b26bc80287de4d53c2b03fd07c629164");
  const adrianStart = teamSource.indexOf('slug: "uiux-product-designer",\n    name: "Adrian Cruz"');
  const adrian = teamSource.slice(adrianStart, teamSource.indexOf("\n  {", adrianStart));
  assert.match(adrian, /Human Factors Engineer at Cepheid/);
  assert.match(adrian, /years not specified/);
  assert.doesNotMatch(adrian.slice(0, adrian.indexOf("externalExperience")), /\d+\+? years/);
});
