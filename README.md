## Ripple Gateway Data Adapter -- Sequelize

To use the Ripple Gateway software requires one to implement a database
backend that exposes the Gateway Data interface. Every Data Adapter must
comply with the interface in order to be complete, and can verify
completeness by running the Data Adapter test suite provided by 
[Ripple Gateway](https://github.com/ripple/rippl-gateway).

### Supported Databases

The [Sequelize](http://sequelizejs.com/) Data Adapter serves as a base
adapter for all supported SQL datastore softwares, including Mysql,
Postgresql, Sqlite, and Mariadb.
