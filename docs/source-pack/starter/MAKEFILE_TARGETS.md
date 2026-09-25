# Required Makefile targets

Generated repository should implement:

```text
make up
make down
make logs
make migrate
make seed-demo
make test
make test-unit
make test-integration
make test-security
make test-e2e
make conformance
make lint
make format
make sbom
make clean
```

`make seed-demo` must be idempotent or provide a documented reset.
