# Database Reference Schema Notes

`001_schema.sql` is the single canonical logical reference schema in this build pack.

The generated application SHOULD implement it through Alembic migrations rather than running this SQL as an uncontrolled production migration.

Important:
- signed semantic payload and node receipt are separate;
- author IDs are strings because future author principals may include Agents, Projects or Collectives;
- access control remains application/policy-layer logic plus carefully designed DB queries; do not depend on frontend hiding;
- vector/search tables may be added as derived projections, never canonical sources of truth.
